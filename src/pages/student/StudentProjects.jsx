import { useState, useEffect, useRef } from 'react';
import { apiCreateProject, apiGetProjects } from '../../api/client';
import { StatusBadge, ProgressBar } from '../../components/UI';
import styles from './StudentProjects.module.css';

const COLORS = ['#E8622A','#2655A6','#2A7A45','#7C3AED'];
const SOFT    = ['#FF9A6C','#60A5FA','#4ADE80','#A78BFA'];

export default function StudentProjects() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', desc: '', due: '', members: 1 });
  const nameInputRef = useRef(null);

  useEffect(() => {
    apiGetProjects().then(setProjects).catch(console.error);
  }, []);

  const createProject = async () => {
    if (!form.name.trim() || !form.due) {
      setError('Project name and due date are required.');
      return;
    }

    setCreating(true);
    setError('');
    try {
      const created = await apiCreateProject({
        name: form.name.trim(),
        desc: form.desc,
        due: form.due,
        members: Number(form.members) || 1,
        progress: 0,
        status: 'pending',
      });
      setProjects(prev => [created, ...prev]);
      setShowModal(false);
      setForm({ name: '', desc: '', due: '', members: 1 });
    } catch (e) {
      setError(e.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    if (showModal && nameInputRef.current) {
      setTimeout(() => nameInputRef.current?.focus(), 50);
    }
  }, [showModal]);

  return (
    <div className="page-enter">
      <div className={styles.headRow}>
        <h2 className={styles.title}>My Projects</h2>
        <button className={styles.addBtn} onClick={() => setShowModal(true)}>+ Add Project</button>
      </div>

      <div className={styles.grid}>
        {projects.map((p, i) => (
          <div key={p.id} className={styles.card}>
            <div
              className={styles.cardTop}
              style={{ background: `linear-gradient(135deg, ${COLORS[i % COLORS.length]} 0%, ${SOFT[i % SOFT.length]} 100%)` }}
            >
              <div className={styles.cardNum}>Project {String(i + 1).padStart(2, '0')}</div>
              <div className={styles.cardName}>{p.name}</div>
              <div className={styles.cardDesc}>{p.desc}</div>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.statsRow}>
                {[['Members', p.members], ['Reviews', p.reviews], ['Done', p.progress + '%']].map(([l, v]) => (
                  <div key={l} className={styles.stat}>
                    <div className={styles.statVal}>{v}</div>
                    <div className={styles.statLbl}>{l}</div>
                  </div>
                ))}
              </div>
              <div className={styles.footer}>
                <span className={styles.due}>Due {p.due}</span>
                <StatusBadge status={p.status} />
              </div>
              <ProgressBar value={p.progress} done={p.status === 'done'} />
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Create New Project</h3>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)} title="Close">✕</button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.field}>
                <label className={styles.label}>Project Name <span className={styles.required}>*</span></label>
                <input 
                  ref={nameInputRef}
                  className={styles.input} 
                  placeholder="Enter project name"
                  value={form.name} 
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                  onKeyPress={e => e.key === 'Enter' && !creating && createProject()}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Description</label>
                <textarea 
                  className={styles.textarea} 
                  placeholder="Add project description (optional)"
                  value={form.desc} 
                  onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} 
                />
              </div>

              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.label}>Due Date <span className={styles.required}>*</span></label>
                  <input 
                    type="date" 
                    className={styles.input} 
                    value={form.due} 
                    onChange={e => setForm(f => ({ ...f, due: e.target.value }))} 
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Team Members</label>
                  <input 
                    type="number" 
                    min="1" 
                    className={styles.input} 
                    placeholder="1"
                    value={form.members} 
                    onChange={e => setForm(f => ({ ...f, members: e.target.value }))} 
                  />
                </div>
              </div>

              {error && <div className={styles.error}>{error}</div>}
            </div>

            <div className={styles.actions}>
              <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
              <button className={styles.createBtn} onClick={createProject} disabled={creating}>
                {creating ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
