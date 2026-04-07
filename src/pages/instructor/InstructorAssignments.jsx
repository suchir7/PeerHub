import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  apiGetAssignments,
  apiGetStudents,
  apiGetAvailableStudents,
  apiAssignStudent,
  apiGetProjects,
  apiCreateAssignment,
  apiGetSettings,
} from '../../api/client';
import { Card, StatusBadge } from '../../components/UI';
import styles from './InstructorAssignments.module.css';

export default function InstructorAssignments() {
  const [list, setList]       = useState([]);
  const [students, setStudents] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [settings, setSettings] = useState({});
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [courseDraft, setCourseDraft] = useState('');
  const [selectedEnrollmentIds, setSelectedEnrollmentIds] = useState([]);
  const [enrolling, setEnrolling] = useState(false);
  const [showModal, setShow]  = useState(false);
  const [form, setForm]       = useState({ reviewerStudentId: '', reviewingStudentId: '', projectId: '', project: '', due: '', semester: '' });
  const [err, setErr]         = useState('');
  const [assignErr, setAssignErr] = useState('');

  const loadAll = () => {
    Promise.all([
      apiGetAssignments(),
      apiGetStudents(),
      apiGetAvailableStudents(),
      apiGetProjects(),
      apiGetSettings(),
    ]).then(([assignmentsData, studentsData, availableData, projectsData, settingsData]) => {
      setList(assignmentsData);
      setStudents(studentsData);
      setAvailableStudents(availableData);
      setProjects(projectsData);
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
  const projectsInCourse = projects.filter(p => !selectedCourse || p.courseName === selectedCourse);
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

  const applyCourseSelection = () => {
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

    setSelectedCourse(nextCourse);
    setSelectedSemester(nextSemester);
    setForm(p => ({ ...p, semester: nextSemester }));
    setSelectedEnrollmentIds([]);
    setAssignErr('');
  };

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
      loadAll();
    } catch (error) {
      setAssignErr(error.message || 'Failed to assign student');
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="page-enter">
      <div className={styles.pageHead}>
        <div>
          <h2 className={styles.pageTitle}>Peer Review Assignments</h2>
          <p className={styles.pageSub}>Manage reviewer pairings and submission deadlines</p>
        </div>
        <button className={styles.addBtn} onClick={() => setShow(true)}>+ New Assignment</button>
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

            <button className={styles.addBtn} onClick={applyCourseSelection}>Create / Select Course</button>
          </div>

          <div className={styles.enrollmentInfoRow}>
            <div className={styles.enrollmentInfo}>
              Active course: <strong>{selectedCourse || 'Not selected'}</strong>
            </div>
            <div className={styles.enrollmentInfo}>
              Students in course: <strong>{studentsInCourse.length}</strong>
            </div>
          </div>

          <div className={styles.candidateList}>
            {enrollmentCandidates.length === 0 && (
              <div className={styles.emptyText}>No students available to add for this course.</div>
            )}
            {enrollmentCandidates.map((student) => (
              <label key={student.id} className={styles.candidateItem}>
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

          <button className={styles.addBtn} onClick={handleAssignStudents} disabled={enrolling}>
            {enrolling ? 'Adding Students...' : 'Add Selected Students To Course'}
          </button>
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
              </tr>
            </thead>
            <tbody>
              {list.map((a, i) => (
                <tr key={a.id || i}>
                  <td className={styles.tdBold}>{a.reviewer}</td>
                  <td className={styles.tdMuted}>{a.reviewing}</td>
                  <td>{a.project}</td>
                  <td className={styles.tdMuted}>{a.due}</td>
                  <td><StatusBadge status={a.status} /></td>
                </tr>
              ))}
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
                <select className={styles.mCtrl} value={form.reviewingStudentId} onChange={e => set('reviewingStudentId', e.target.value)}>
                  <option value="">Select…</option>
                  {studentsInCourse.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className={styles.mField}>
                <label className={styles.mLabel}>Existing Project (optional)</label>
                <select className={styles.mCtrl} value={form.projectId} onChange={e => set('projectId', e.target.value)}>
                  <option value="">Select…</option>
                  {projectsInCourse.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              <div className={styles.mField}>
                <label className={styles.mLabel}>Or New Project Name</label>
                <input className={styles.mCtrl} value={form.project} onChange={e => set('project', e.target.value)} placeholder="Enter new project name" />
              </div>

              <div className={styles.mField}>
                <label className={styles.mLabel}>Due Date</label>
                <input className={styles.mCtrl} type="date" value={form.due} onChange={e => set('due', e.target.value)} />
              </div>

              {err && <div className={styles.mErr}>{err}</div>}
            </div>

            <div className={styles.mActions}>
              <button className={styles.mCancel} onClick={() => setShow(false)}>Cancel</button>
              <button className={styles.mCreate} onClick={handleCreate}>Create Assignment</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
