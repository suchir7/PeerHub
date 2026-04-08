import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  apiGetAssignments,
  apiGetStudents,
  apiGetAvailableStudents,
  apiAssignStudent,
  apiUnassignStudent,
  apiCreateAssignment,
  apiGetSettings,
  apiUpdateSettings,
  apiGetProjectsForStudent,
  apiUpdateAssignment,
  apiDeleteAssignment,
} from '../../api/client';
import { Card, StatusBadge } from '../../components/UI';
import styles from './InstructorAssignments.module.css';

export default function InstructorAssignments() {
  const [list, setList]       = useState([]);
  const [students, setStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [reviewingProjects, setReviewingProjects] = useState([]);
  const [loadingReviewingProjects, setLoadingReviewingProjects] = useState(false);
  const [settings, setSettings] = useState({});
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [courseDraft, setCourseDraft] = useState('');
  const [selectedEnrollmentIds, setSelectedEnrollmentIds] = useState([]);
  const [selectedRemovalIds, setSelectedRemovalIds] = useState([]);
  const [enrolling, setEnrolling] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [savingCourse, setSavingCourse] = useState(false);
  const [showModal, setShow]  = useState(false);
  const [editingAssignmentId, setEditingAssignmentId] = useState(null);
  const [editingDue, setEditingDue] = useState('');
  const [editingStatus, setEditingStatus] = useState('pending');
  const [savingAssignment, setSavingAssignment] = useState(false);
  const [deletingAssignmentId, setDeletingAssignmentId] = useState(null);
  const [form, setForm]       = useState({ reviewerStudentId: '', reviewingStudentId: '', projectId: '', project: '', due: '', semester: '' });
  const [err, setErr]         = useState('');
  const [assignErr, setAssignErr] = useState('');

  const loadAll = () => {
    Promise.all([
      apiGetAssignments(),
      apiGetStudents(),
      apiGetAvailableStudents(),
      apiGetSettings(),
    ]).then(([assignmentsData, studentsData, availableData, settingsData]) => {
      setList(assignmentsData);
      setStudents(studentsData);
      setAvailableStudents(availableData);
      setSettings(settingsData || {});

      const fallbackCourse = settingsData?.courseName || '';
      const fallbackSemester = settingsData?.semester || '';
      setSelectedCourse((prev) => prev || fallbackCourse);
      setSelectedSemester((prev) => prev || fallbackSemester);
      setCourseDraft((prev) => prev || fallbackCourse);
      setForm(p => ({ ...p, semester: fallbackSemester }));
    }).catch(console.error);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErr(''); };

  const knownCourses = Array.from(new Set([
    ...students.map(s => s.team).filter(c => c && c !== 'Unassigned'),
    settings.courseName,
  ].filter(Boolean))).sort((a, b) => a.localeCompare(b));

  const studentsInCourse = students.filter(s => selectedCourse && s.team === selectedCourse);
  const assignmentsInCourse = selectedCourse
    ? list.filter(a => (a.courseName || '') === selectedCourse)
    : list;
  const availableById = new Set(availableStudents.map(s => s.id));
  const reassignmentCandidates = students.filter(s => selectedCourse && s.team !== selectedCourse);
  const enrollmentCandidates = [
    ...availableStudents.map(s => ({ ...s, candidateType: 'new' })),
    ...reassignmentCandidates
      .filter(s => !availableById.has(s.id))
      .map(s => ({ ...s, candidateType: 'move' })),
  ];

  const toggleEnrollment = (studentId) => {
    setAssignErr('');
    setSelectedEnrollmentIds((prev) => (
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    ));
  };

  const toggleRemoval = (studentId) => {
    setAssignErr('');
    setSelectedRemovalIds((prev) => (
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    ));
  };

  const applyCourseSelection = async () => {
    const nextCourse = courseDraft.trim();
    const nextSemester = selectedSemester.trim();

    if (!nextCourse) {
      setAssignErr('Enter a course name to continue.');
      return;
    }
    if (!nextSemester) {
      setAssignErr('Enter semester before creating/selecting a course.');
      return;
    }

    try {
      setSavingCourse(true);
      const updated = await apiUpdateSettings({
        courseName: nextCourse,
        semester: nextSemester,
      });
      setSettings(updated || {});
      setSelectedCourse(nextCourse);
      setSelectedSemester(nextSemester);
      setForm(p => ({ ...p, semester: nextSemester }));
      setSelectedEnrollmentIds([]);
      setSelectedRemovalIds([]);
      setAssignErr('');
    } catch (error) {
      setAssignErr(error.message || 'Failed to save course settings');
    } finally {
      setSavingCourse(false);
    }
  };

  useEffect(() => {
    if (!form.reviewingStudentId) {
      setReviewingProjects([]);
      return;
    }

    setLoadingReviewingProjects(true);
    apiGetProjectsForStudent(form.reviewingStudentId)
      .then((data) => setReviewingProjects(Array.isArray(data) ? data : []))
      .catch(() => setReviewingProjects([]))
      .finally(() => setLoadingReviewingProjects(false));
  }, [form.reviewingStudentId]);

  const handleCreate = async () => {
    if (!selectedCourse.trim()) {
      setErr('Create or select a course first.');
      return;
    }
    if (!form.reviewerStudentId || !form.reviewingStudentId || !form.due) {
      setErr('Please fill in all fields.'); return;
    }
    if (form.reviewerStudentId === form.reviewingStudentId) {
      setErr('Reviewer and reviewing student must be different.');
      return;
    }
    if (!form.projectId && !form.project.trim()) {
      setErr('Select a project or enter a new project name.'); return;
    }
    try {
      const newAssignment = await apiCreateAssignment({
        reviewerStudentId: Number(form.reviewerStudentId),
        reviewingStudentId: Number(form.reviewingStudentId),
        projectId: form.projectId ? Number(form.projectId) : null,
        project: form.project,
        due: form.due,
        courseName: selectedCourse,
        semester: form.semester || selectedSemester || settings.semester || '',
      });
      setList(l => [...l, newAssignment]);
      setShow(false);
      setForm({ reviewerStudentId: '', reviewingStudentId: '', projectId: '', project: '', due: '', semester: selectedSemester || settings?.semester || '' });
    } catch (error) {
      setErr(error.message || 'Failed to create assignment');
    }
  };

  const startEditAssignment = (assignment) => {
    setEditingAssignmentId(assignment.id);
    setEditingDue(assignment.due || '');
    setEditingStatus(String(assignment.status || 'pending').toLowerCase());
  };

  const cancelEditAssignment = () => {
    setEditingAssignmentId(null);
    setEditingDue('');
    setEditingStatus('pending');
  };

  const saveAssignment = async (id) => {
    if (!editingDue) {
      setAssignErr('Due date is required to update assignment.');
      return;
    }
    try {
      setSavingAssignment(true);
      const updated = await apiUpdateAssignment(id, { due: editingDue, status: editingStatus });
      setList(prev => prev.map(a => (a.id === id ? updated : a)));
      setAssignErr('');
      cancelEditAssignment();
    } catch (error) {
      setAssignErr(error.message || 'Failed to update assignment');
    } finally {
      setSavingAssignment(false);
    }
  };

  const removeAssignment = async (id) => {
    const confirmed = window.confirm('Delete this assignment?');
    if (!confirmed) return;
    try {
      setDeletingAssignmentId(id);
      await apiDeleteAssignment(id);
      setList(prev => prev.filter(a => a.id !== id));
      setAssignErr('');
    } catch (error) {
      setAssignErr(error.message || 'Failed to delete assignment');
    } finally {
      setDeletingAssignmentId(null);
    }
  };

  const handleAssignStudents = async () => {
    if (!selectedCourse.trim()) {
      setAssignErr('Create or select a course first.');
      return;
    }
    if (!selectedSemester.trim()) {
      setAssignErr('Enter semester before adding students.');
      return;
    }
    if (selectedEnrollmentIds.length === 0) {
      setAssignErr('Select at least one student to add to this course.');
      return;
    }

    try {
      setEnrolling(true);
      await Promise.all(
        selectedEnrollmentIds.map((studentId) =>
          apiAssignStudent(Number(studentId), {
            courseName: selectedCourse.trim(),
            semester: selectedSemester.trim(),
          })
        )
      );
      setAssignErr('');
      setSelectedEnrollmentIds([]);
      setSelectedRemovalIds([]);
      loadAll();
    } catch (error) {
      setAssignErr(error.message || 'Failed to assign student');
    } finally {
      setEnrolling(false);
    }
  };

  const handleRemoveStudents = async () => {
    if (!selectedCourse.trim()) {
      setAssignErr('Select a course first.');
      return;
    }
    if (selectedRemovalIds.length === 0) {
      setAssignErr('Select at least one student to remove from this course.');
      return;
    }

    try {
      setRemoving(true);
      await Promise.all(selectedRemovalIds.map((studentId) => apiUnassignStudent(Number(studentId))));
      setAssignErr('');
      setSelectedRemovalIds([]);
      setSelectedEnrollmentIds([]);
      loadAll();
    } catch (error) {
      setAssignErr(error.message || 'Failed to remove student(s)');
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="page-enter">
      <div className={styles.pageHead}>
        <div>
          <h2 className={styles.pageTitle}>Peer Review Assignments</h2>
          <p className={styles.pageSub}>Manage reviewer pairings and submission deadlines</p>
        </div>
        <button
          className={styles.addBtn}
          onClick={() => setShow(true)}
          disabled={!selectedCourse || studentsInCourse.length < 2}
          title={!selectedCourse ? 'Select a course first' : (studentsInCourse.length < 2 ? 'At least 2 students are required' : 'Create assignment')}
        >
          + New Assignment
        </button>
      </div>

      <Card>
        <div className={styles.enrollmentWrap}>
          <h4 className={styles.sectionTitle}>Course Setup & Student Enrollment</h4>
          <div className={styles.enrollmentGrid}>
            <div className={styles.enrollField}>
              <label className={styles.enrollLabel}>Existing Course</label>
              <select
                className={styles.mCtrl}
                value={selectedCourse}
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  setCourseDraft(e.target.value);
                  setAssignErr('');
                }}
              >
                <option value="">Select existing course</option>
                {knownCourses.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className={styles.enrollField}>
              <label className={styles.enrollLabel}>Course Name</label>
              <input
                className={styles.mCtrl}
                value={courseDraft}
                onChange={(e) => {
                  setCourseDraft(e.target.value);
                  setAssignErr('');
                }}
                placeholder="e.g. FSAD"
              />
            </div>

            <div className={styles.enrollField}>
              <label className={styles.enrollLabel}>Semester</label>
              <input
                className={styles.mCtrl}
                value={selectedSemester}
                onChange={(e) => {
                  setSelectedSemester(e.target.value);
                  setForm(p => ({ ...p, semester: e.target.value }));
                  setAssignErr('');
                }}
                placeholder="e.g. Spring 2026"
              />
            </div>

            <button className={styles.addBtn} onClick={applyCourseSelection} disabled={savingCourse}>
              {savingCourse ? 'Saving...' : 'Create / Select Course'}
            </button>
          </div>

          <div className={styles.enrollmentInfoRow}>
            <div className={styles.enrollmentInfo}>
              Active course: <strong>{selectedCourse || 'Not selected'}</strong>
            </div>
            <div className={styles.enrollmentInfo}>
              Students in course: <strong>{studentsInCourse.length}</strong>
            </div>
          </div>

          <div className={styles.studentManagerGrid}>
            <div className={styles.managerPanel}>
              <div className={styles.panelTitle}>Add Students To {selectedCourse || 'Course'}</div>
              <div className={styles.candidateList}>
                {enrollmentCandidates.length === 0 && (
                  <div className={styles.emptyText}>No students available to add for this course.</div>
                )}
                {enrollmentCandidates.map((student) => (
                  <label key={`add-${student.id}`} className={styles.candidateItem}>
                    <input
                      type="checkbox"
                      checked={selectedEnrollmentIds.includes(student.id)}
                      onChange={() => toggleEnrollment(student.id)}
                    />
                    <span className={styles.candidateName}>{student.name}</span>
                    <span className={styles.candidateMeta}>
                      {student.candidateType === 'new' ? 'Available' : `Move from ${student.team || 'Unassigned'}`}
                    </span>
                  </label>
                ))}
              </div>
              <button className={styles.addBtn} onClick={handleAssignStudents} disabled={enrolling || !selectedCourse}>
                {enrolling ? 'Adding Students...' : 'Add Selected Students'}
              </button>
            </div>

            <div className={styles.managerPanel}>
              <div className={styles.panelTitle}>Remove Students From {selectedCourse || 'Course'}</div>
              <div className={styles.candidateList}>
                {studentsInCourse.length === 0 && (
                  <div className={styles.emptyText}>No students currently enrolled in this course.</div>
                )}
                {studentsInCourse.map((student) => (
                  <label key={`remove-${student.id}`} className={styles.candidateItem}>
                    <input
                      type="checkbox"
                      checked={selectedRemovalIds.includes(student.id)}
                      onChange={() => toggleRemoval(student.id)}
                    />
                    <span className={styles.candidateName}>{student.name}</span>
                    <span className={styles.candidateMeta}>{student.email || student.team}</span>
                  </label>
                ))}
              </div>
              <button className={styles.removeBtn} onClick={handleRemoveStudents} disabled={removing || !selectedCourse}>
                {removing ? 'Removing Students...' : 'Remove Selected Students'}
              </button>
            </div>
          </div>

          {assignErr && <div className={styles.mErr}>{assignErr}</div>}
        </div>
      </Card>

      <Card>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Reviewer</th>
                <th>Reviewing</th>
                <th>Project</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignmentsInCourse.map((a, i) => (
                <tr key={a.id || i}>
                  <td className={styles.tdBold}>{a.reviewer}</td>
                  <td className={styles.tdMuted}>{a.reviewing}</td>
                  <td>{a.project}</td>
                  <td className={styles.tdMuted}>
                    {editingAssignmentId === a.id ? (
                      <input
                        type="date"
                        className={styles.inlineInput}
                        value={editingDue}
                        onChange={(e) => setEditingDue(e.target.value)}
                      />
                    ) : a.due}
                  </td>
                  <td>
                    {editingAssignmentId === a.id ? (
                      <select className={styles.inlineSelect} value={editingStatus} onChange={(e) => setEditingStatus(e.target.value)}>
                        <option value="pending">pending</option>
                        <option value="done">done</option>
                      </select>
                    ) : <StatusBadge status={a.status} />}
                  </td>
                  <td>
                    <div className={styles.actionRow}>
                      {editingAssignmentId === a.id ? (
                        <>
                          <button className={styles.smallBtn} onClick={() => saveAssignment(a.id)} disabled={savingAssignment}>Save</button>
                          <button className={styles.smallBtnGhost} onClick={cancelEditAssignment}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className={styles.smallBtn} onClick={() => startEditAssignment(a)}>Edit</button>
                          <button
                            className={styles.smallBtnDanger}
                            onClick={() => removeAssignment(a.id)}
                            disabled={deletingAssignmentId === a.id}
                          >
                            {deletingAssignmentId === a.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {assignmentsInCourse.length === 0 && (
                <tr>
                  <td className={styles.emptyRow} colSpan={6}>
                    {selectedCourse
                      ? `No assignments found for ${selectedCourse}.`
                      : 'No assignments created yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {showModal && createPortal(
        <div className={styles.overlay} onClick={() => setShow(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Create New Assignment</h3>
              <button className={styles.closeBtn} onClick={() => setShow(false)} title="Close">✕</button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.mField}>
                <label className={styles.mLabel}>Course</label>
                <select
                  className={styles.mCtrl}
                  value={selectedCourse}
                  onChange={e => {
                    setSelectedCourse(e.target.value);
                    setErr('');
                  }}
                >
                  <option value="">Select a course</option>
                  {knownCourses.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className={styles.mField}>
                <label className={styles.mLabel}>Semester</label>
                <input
                  className={styles.mCtrl}
                  value={form.semester}
                  onChange={e => set('semester', e.target.value)}
                  placeholder="e.g. Spring 2026"
                />
              </div>

              <div className={styles.mField}>
                <label className={styles.mLabel}>Reviewer</label>
                <select className={styles.mCtrl} value={form.reviewerStudentId} onChange={e => set('reviewerStudentId', e.target.value)}>
                  <option value="">Select…</option>
                  {studentsInCourse.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className={styles.mField}>
                <label className={styles.mLabel}>Reviewing</label>
                <select
                  className={styles.mCtrl}
                  value={form.reviewingStudentId}
                  onChange={e => {
                    const value = e.target.value;
                    set('reviewingStudentId', value);
                    set('projectId', '');
                  }}
                >
                  <option value="">Select…</option>
                  {studentsInCourse.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className={styles.mField}>
                <label className={styles.mLabel}>Existing Project of Reviewing Student (optional)</label>
                <select className={styles.mCtrl} value={form.projectId} onChange={e => set('projectId', e.target.value)}>
                  <option value="">
                    {!form.reviewingStudentId
                      ? 'Select reviewing student first'
                      : (loadingReviewingProjects ? 'Loading projects...' : 'Select project...')}
                  </option>
                  {reviewingProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                {!!form.reviewingStudentId && !loadingReviewingProjects && reviewingProjects.length === 0 && (
                  <div className={styles.helperText}>No existing projects found for this student. Enter a new project name below.</div>
                )}
              </div>

              <div className={styles.mField}>
                <label className={styles.mLabel}>Or New Project Name</label>
                <input className={styles.mCtrl} value={form.project} onChange={e => set('project', e.target.value)} placeholder="Enter new project name" />
              </div>

              <div className={styles.mField}>
                <label className={styles.mLabel}>Due Date</label>
                <input className={styles.mCtrl} type="date" value={form.due} onChange={e => set('due', e.target.value)} />
              </div>

              {studentsInCourse.length < 2 && (
                <div className={styles.mErr}>At least 2 students must be enrolled in this course before creating assignments.</div>
              )}

              {err && <div className={styles.mErr}>{err}</div>}
            </div>

            <div className={styles.mActions}>
              <button className={styles.mCancel} onClick={() => setShow(false)}>Cancel</button>
              <button className={styles.mCreate} onClick={handleCreate} disabled={studentsInCourse.length < 2}>Create Assignment</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
