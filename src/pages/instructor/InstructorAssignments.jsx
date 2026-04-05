import { useState, useEffect } from 'react';
import { apiGetAssignments, apiGetStudents, apiGetProjects, apiCreateAssignment } from '../../api/client';
import { Card, StatusBadge } from '../../components/UI';
import styles from './InstructorAssignments.module.css';

export default function InstructorAssignments() {
  const [list, setList]       = useState([]);
  const [students, setStudents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showModal, setShow]  = useState(false);
  const [form, setForm]       = useState({ reviewer: '', reviewing: '', project: '', due: '' });
  const [err, setErr]         = useState('');

  useEffect(() => {
    apiGetAssignments().then(setList).catch(console.error);
    apiGetStudents().then(setStudents).catch(console.error);
    apiGetProjects().then(setProjects).catch(console.error);
  }, []);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErr(''); };

  const handleCreate = async () => {
    if (!form.reviewer || !form.reviewing || !form.project || !form.due) {
      setErr('Please fill in all fields.'); return;
    }
    try {
      const newAssignment = await apiCreateAssignment(form);
      setList(l => [...l, newAssignment]);
      setShow(false);
      setForm({ reviewer: '', reviewing: '', project: '', due: '' });
    } catch (error) {
      setErr(error.message || 'Failed to create assignment');
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
            <h3 className={styles.modalTitle}>Create New Assignment</h3>

            {[
              { label: 'Reviewer', key: 'reviewer', opts: students.map(s => s.name) },
              { label: 'Reviewing', key: 'reviewing', opts: students.map(s => s.name) },
              { label: 'Project',  key: 'project',  opts: projects.map(p => p.name) },
            ].map(f => (
              <div key={f.key} className={styles.mField}>
                <label className={styles.mLabel}>{f.label}</label>
                <select className={styles.mCtrl} value={form[f.key]} onChange={e => set(f.key, e.target.value)}>
                  <option value="">Select…</option>
                  {f.opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}

            <div className={styles.mField}>
              <label className={styles.mLabel}>Due Date</label>
              <input className={styles.mCtrl} type="date" value={form.due} onChange={e => set('due', e.target.value)} />
            </div>

            {err && <div className={styles.mErr}>{err}</div>}

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
