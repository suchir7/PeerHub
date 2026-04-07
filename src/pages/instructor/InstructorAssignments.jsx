import { useState, useEffect } from 'react';
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
  const [showModal, setShow]  = useState(false);
  const [form, setForm]       = useState({ reviewerStudentId: '', reviewingStudentId: '', projectId: '', project: '', due: '', semester: '' });
  const [studentToAssign, setStudentToAssign] = useState('');
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
      setSelectedCourse(fallbackCourse);
      setForm(p => ({ ...p, semester: settingsData?.semester || '' }));
    }).catch(console.error);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErr(''); };

  const studentsInCourse = students.filter(s => !selectedCourse || s.team === selectedCourse);
  const projectsInCourse = projects.filter(p => !selectedCourse || p.courseName === selectedCourse);

  const handleCreate = async () => {
    if (!form.reviewerStudentId || !form.reviewingStudentId || !form.due) {
      setErr('Please fill in all fields.'); return;
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
        courseName: selectedCourse || settings.courseName || '',
        semester: form.semester || settings.semester || '',
      });
      setList(l => [...l, newAssignment]);
      setShow(false);
      setForm({ reviewerStudentId: '', reviewingStudentId: '', projectId: '', project: '', due: '', semester: settings?.semester || '' });
    } catch (error) {
      setErr(error.message || 'Failed to create assignment');
    }
  };

  const handleAssignStudent = async () => {
    if (!studentToAssign) {
      setAssignErr('Please select a student to assign.');
      return;
    }
    const courseName = selectedCourse || settings.courseName || '';
    const semester = form.semester || settings.semester || '';
    if (!courseName || !semester) {
      setAssignErr('Set course name and semester in instructor settings first.');
      return;
    }

    try {
      await apiAssignStudent(Number(studentToAssign), { courseName, semester });
      setStudentToAssign('');
      setAssignErr('');
      loadAll();
    } catch (error) {
      setAssignErr(error.message || 'Failed to assign student');
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
        <div className={styles.tableWrap} style={{ padding: '1rem' }}>
          <h4 style={{ margin: 0, marginBottom: 12 }}>Student Enrollment</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, alignItems: 'end' }}>
            <div>
              <label style={{ fontSize: 12 }}>Course</label>
              <select className={styles.mCtrl} value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                <option value="">{settings.courseName || 'Select / set course in settings'}</option>
                {[...new Set(students.map(s => s.team).filter(Boolean))].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12 }}>Available Students</label>
              <select className={styles.mCtrl} value={studentToAssign} onChange={(e) => { setStudentToAssign(e.target.value); setAssignErr(''); }}>
                <option value="">Select student...</option>
                {availableStudents.map(s => <option key={s.id} value={s.id}>{s.name} ({s.email})</option>)}
              </select>
            </div>
            <button className={styles.addBtn} onClick={handleAssignStudent}>Assign Student</button>
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

      {showModal && (
        <div className={styles.overlay} onClick={() => setShow(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Create New Assignment</h3>
              <button className={styles.closeBtn} onClick={() => setShow(false)} title="Close">✕</button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.mField}>
                <label className={styles.mLabel}>Course</label>
                <select className={styles.mCtrl} value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
                  <option value="">{settings.courseName || 'Set course in settings'}</option>
                  {[...new Set(students.map(s => s.team).filter(Boolean))].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
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

              <div className={styles.mField}>
                <label className={styles.mLabel}>Semester</label>
                <input className={styles.mCtrl} value={form.semester} onChange={e => set('semester', e.target.value)} placeholder="e.g. Spring 2026" />
              </div>

              {err && <div className={styles.mErr}>{err}</div>}
            </div>

            <div className={styles.mActions}>
              <button className={styles.mCancel} onClick={() => setShow(false)}>Cancel</button>
              <button className={styles.mCreate} onClick={handleCreate}>Create Assignment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
