import { useState } from 'react';
import { ASSIGNMENTS, STUDENTS, PROJECTS } from '../../data/mockData';
import { Card, StatusBadge } from '../../components/UI';
import styles from './InstructorAssignments.module.css';

export default function InstructorAssignments() {
  const [list, setList]       = useState(ASSIGNMENTS);
  const [showModal, setShow]  = useState(false);
  const [form, setForm]       = useState({ reviewer: '', reviewing: '', project: '', due: '' });
  const [err, setErr]         = useState('');

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErr(''); };

  const handleCreate = () => {
    if (!form.reviewer || !form.reviewing || !form.project || !form.due) {
      setErr('Please fill in all fields.'); return;
    }
    setList(l => [...l, { ...form, status: 'pending' }]);
    setShow(false);
    setForm({ reviewer: '', reviewing: '', project: '', due: '' });
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
                <tr key={i}>
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
              { label: 'Reviewer', key: 'reviewer', opts: STUDENTS.map(s => s.name) },
              { label: 'Reviewing', key: 'reviewing', opts: STUDENTS.map(s => s.name) },
              { label: 'Project',  key: 'project',  opts: PROJECTS.map(p => p.name) },
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
