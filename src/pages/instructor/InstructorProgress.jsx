import { STUDENTS } from '../../data/mockData';
import { Card, ProgressBar, Avatar } from '../../components/UI';
import styles from './InstructorProgress.module.css';

const RANK_COLORS = ['#E8622A','#D97706','#6366F1','rgba(26,23,20,.1)','rgba(26,23,20,.1)'];
const RANK_TEXT   = ['#fff',   '#fff',   '#fff',   'rgba(26,23,20,.4)','rgba(26,23,20,.4)'];

export default function InstructorProgress() {
  return (
    <div className="page-enter">
      <Card>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Student</th>
                <th>Team</th>
                <th>Submissions</th>
                <th>Reviews Given</th>
                <th>Avg Score</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {STUDENTS.map((s, i) => (
                <tr key={s.name}>
                  <td>
                    <div className={styles.rank} style={{ background: RANK_COLORS[i], color: RANK_TEXT[i] }}>
                      {i + 1}
                    </div>
                  </td>
                  <td>
                    <div className={styles.studentCell}>
                      <Avatar initials={s.initials} color={s.color} size={32} />
                      <span className={styles.studentName}>{s.name}</span>
                    </div>
                  </td>
                  <td className={styles.tdMuted}>{s.team}</td>
                  <td>{s.submissions}</td>
                  <td>{s.reviews}</td>
                  <td className={styles.tdScore}>{s.score}</td>
                  <td style={{ minWidth: 120 }}>
                    <ProgressBar value={s.score} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
