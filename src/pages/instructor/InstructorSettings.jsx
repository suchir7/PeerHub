import { useState, useEffect } from 'react';
import { apiGetSettings, apiUpdateSettings } from '../../api/client';
import { Card, CardHeader } from '../../components/UI';
import styles from './InstructorSettings.module.css';

const SETTING_KEYS = [
  { key: 'courseName',            label: 'Course Name' },
  { key: 'semester',              label: 'Semester' },
  { key: 'reviewDeadlineBuffer',  label: 'Review Deadline Buffer' },
  { key: 'anonymousReviews',      label: 'Anonymous Reviews' },
  { key: 'maxReviewsPerStudent',  label: 'Max Reviews per Student' },
  { key: 'gradingVisibility',     label: 'Grading Visibility' },
];

export default function InstructorSettings() {
  const [settings, setSettings] = useState({});
  const [editing, setEditing]   = useState(null);
  const [editVal, setEditVal]   = useState('');
  const [saving, setSaving]     = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    apiGetSettings().then(setSettings).catch(console.error);
  }, []);

  const startEdit = (key, value) => {
    setEditing(key);
    setEditVal(value);
    setSaveError('');
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const updated = await apiUpdateSettings({ [editing]: editVal });
      setSettings(updated);
      setEditing(null);
    } catch (err) {
      setSaveError(err.message || 'Failed to save setting');
    }
    setSaving(false);
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditVal('');
    setSaveError('');
  };

  return (
    <div className="page-enter">
      <Card>
        <CardHeader title="Course Settings" />
        <div className={styles.body}>
          {saveError && <div className={styles.errorBox}>{saveError}</div>}
          {SETTING_KEYS.map(s => (
            <div key={s.key} className={styles.row}>
              <div className={styles.key}>{s.label}</div>
              {editing === s.key ? (
                <div className={styles.editRow}>
                  <input
                    className={styles.editInput}
                    value={editVal}
                    onChange={e => setEditVal(e.target.value)}
                    autoFocus
                  />
                  <button className={styles.saveBtn} onClick={saveEdit} disabled={saving}>
                    {saving ? '...' : 'Save'}
                  </button>
                  <button className={styles.cancelBtn} onClick={cancelEdit}>Cancel</button>
                </div>
              ) : (
                <div className={styles.val} onClick={() => startEdit(s.key, settings[s.key] || '')}>
                  {settings[s.key] || '—'}
                  <span className={styles.editHint}>click to edit</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
