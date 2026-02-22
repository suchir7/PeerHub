import { Card, CardHeader } from '../../components/UI';
import styles from './InstructorSettings.module.css';

const SETTINGS = [
  { key: 'Course Name',              value: 'FSAD-PS26 — Full Stack Application Development' },
  { key: 'Semester',                 value: 'Spring 2025' },
  { key: 'Review Deadline Buffer',   value: '3 days after submission' },
  { key: 'Anonymous Reviews',        value: 'Enabled' },
  { key: 'Max Reviews per Student',  value: '3' },
  { key: 'Grading Visibility',       value: 'Instructor only until deadline' },
];

export default function InstructorSettings() {
  return (
    <div className="page-enter">
      <Card>
        <CardHeader title="Course Settings" />
        <div className={styles.body}>
          {SETTINGS.map(s => (
            <div key={s.key} className={styles.row}>
              <div className={styles.key}>{s.key}</div>
              <div className={styles.val}>{s.value}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
