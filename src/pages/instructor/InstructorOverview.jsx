import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiGetAssignments, apiGetProjects, apiGetReviews, apiGetStudents } from '../../api/client';
import { StatCard, Card, CardHeader, ProgressBar, StatusBadge, Avatar } from '../../components/UI';
import { IconGraduationCap, IconFolder, IconEdit, IconAlertTriangle, IconTrophy } from '../../components/Icons';
import styles from './InstructorOverview.module.css';

const RANK_COLORS = ['#E8622A', '#D97706', '#6366F1', 'rgba(26,23,20,.1)', 'rgba(26,23,20,.1)'];
const RANK_TEXT   = ['#fff',    '#fff',    '#fff',    'rgba(26,23,20,.45)','rgba(26,23,20,.45)'];

export default function InstructorOverview() {
  const { user } = useAuth();
  const firstName = user?.name || 'Professor';

  const [projects, setProjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    apiGetProjects().then(setProjects).catch(console.error);
    apiGetStudents().then(setStudents).catch(console.error);
    apiGetAssignments().then(setAssignments).catch(console.error);
    apiGetReviews().then(setReviews).catch(console.error);
  }, []);

  const totalReviews = reviews.length;
  const pendingAssignments = assignments.filter(a => String(a.status || '').toLowerCase() === 'pending').length;
  const completionRate = assignments.length
    ? Math.round(((assignments.length - pendingAssignments) / assignments.length) * 100)
    : 0;
  const rankedStudents = [...students].sort((a, b) => (b.score || 0) - (a.score || 0));

  return (
    <div className="page-enter">
      <div className={styles.banner}>
        <div className={styles.bannerContent}>
          <div className={styles.bannerEye}>Instructor Dashboard</div>
          <div className={styles.bannerName}>Welcome, {firstName}.</div>
          <div className={styles.bannerSub}>Course workspace · {students.length} students enrolled across {projects.length} projects.</div>
        </div>
        <div className={styles.bannerDecor}><IconGraduationCap size={48} color="var(--orange-soft)" /></div>
      </div>

      <div className={styles.statsRow}>
        <StatCard icon={<IconGraduationCap size={20} />} value={students.length || '0'} label="Students"     note={`${projects.length} projects tracked`} chipColor="chipOrange" />
        <StatCard icon={<IconFolder size={20} />}         value={projects.length || '0'} label="Projects"     note={`${assignments.length} assignments total`} chipColor="chipBlue"   />
        <StatCard icon={<IconEdit size={20} />}           value={totalReviews || '0'}     label="Reviews Done" note={`${completionRate}% completion`} chipColor="chipGreen"  />
        <StatCard icon={<IconAlertTriangle size={20} />}  value={pendingAssignments || '0'} label="Pending"    note="Need reviewer action" chipColor="chipYellow" />
      </div>

      <div className={styles.grid}>
        <Card>
          <CardHeader title="Project Overview" />
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Team</th>
                  <th>Reviews</th>
                  <th>Progress</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p.id}>
                    <td className={styles.tdName}>{p.name}</td>
                    <td className={styles.tdMuted}>{p.courseName || 'Course Project'}</td>
                    <td>{p.reviews}</td>
                    <td><ProgressBar value={p.progress} done={p.status === 'done'} /></td>
                    <td><StatusBadge status={p.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <CardHeader title={<span className={styles.leaderTitle}><IconTrophy size={18} color="var(--orange)" /> Top Performers</span>} />
          <div className={styles.leaderBody}>
            {rankedStudents.map((s, i) => (
              <div key={s.id || s.name} className={styles.leaderRow}>
                <div
                  className={styles.rank}
                  style={{ background: RANK_COLORS[i % RANK_COLORS.length], color: RANK_TEXT[i % RANK_TEXT.length] }}
                >
                  {i + 1}
                </div>
                <Avatar initials={s.initials} color={s.color} />
                <div className={styles.leaderInfo}>
                  <div className={styles.leaderName}>{s.name}</div>
                  <div className={styles.leaderTeam}>{s.team}</div>
                </div>
                <div className={styles.leaderScore}>{s.score}</div>
              </div>
            ))}
            {rankedStudents.length === 0 && <div className={styles.emptyState}>No students enrolled yet.</div>}
          </div>
        </Card>
      </div>
    </div>
  );
}
