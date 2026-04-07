import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiGetProjects, apiGetReviews, apiGetPendingReviews, apiGetStudentProfile } from '../../api/client';
import { StatCard, Card, CardHeader, ProgressBar, StatusBadge, Avatar } from '../../components/UI';
import { IconFolder, IconEdit, IconStar, IconClock, IconClipboard, IconWave } from '../../components/Icons';
import styles from './StudentDashboard.module.css';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.name?.split(' ')[0] || 'there';

  const [projects, setProjects] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [pending, setPending] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    apiGetProjects().then(setProjects).catch(console.error);
    apiGetReviews().then(setReviews).catch(console.error);
    apiGetPendingReviews().then(setPending).catch(console.error);
    apiGetStudentProfile().then(setProfile).catch(console.error);
  }, []);

  return (
    <div className="page-enter">
      {/* Welcome Banner */}
      <div className={styles.banner}>
        <div className={styles.bannerContent}>
          <div className={styles.bannerEye}>Student Dashboard</div>
          <div className={styles.bannerName}>
            Good morning, {firstName}. <IconWave size={22} color="var(--orange)" />
          </div>
          <div className={styles.bannerSub}>You have {pending.length} pending peer reviews this week — keep the momentum going.</div>
          <div className={styles.bannerSub}>
            Instructor: {profile?.instructorName || 'Not assigned'} · Course: {profile?.courseName || 'Not assigned'} · Semester: {profile?.semester || 'Not assigned'}
          </div>
        </div>
        <div className={styles.bannerDecor}><IconBookOpen size={48} color="var(--orange-soft)" /></div>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        <StatCard icon={<IconFolder size={20} />} value={projects.filter(p => p.status !== 'done').length || '0'} label="Active Projects"  note="1 added this week"  chipColor="chipOrange" />
        <StatCard icon={<IconEdit size={20} />}   value={reviews.length || '0'} label="Reviews Given"    note={`↑ ${reviews.length} total`}     chipColor="chipGreen"  />
        <StatCard icon={<IconStar size={20} />}    value={reviews.length ? Math.round(reviews.reduce((a, r) => a + r.score, 0) / reviews.length) : '0'} label="Average Score"   note="All time"  chipColor="chipBlue"   />
        <StatCard icon={<IconClock size={20} />}   value={pending.length || '0'} label="Due This Week"    note="Before deadline"       chipColor="chipYellow" />
      </div>

      {/* Content Grid */}
      <div className={styles.grid}>
        {/* Projects */}
        <Card>
          <CardHeader title="My Projects" action="View all" />
          <div className={styles.cardBody}>
            {projects.slice(0, 3).map(p => (
              <div key={p.id} className={styles.projItem}>
                <div className={styles.projTop}>
                  <div>
                    <div className={styles.projName}>{p.name}</div>
                    <div className={styles.projMeta}>{p.members} members · Due {p.due} · {p.reviews} review{p.reviews !== 1 ? 's' : ''}</div>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <div className={styles.progLabels}>
                  <span>Progress</span><span>{p.progress}%</span>
                </div>
                <ProgressBar value={p.progress} done={p.status === 'done'} />
              </div>
            ))}
          </div>
        </Card>

        <div className={styles.col}>
          {/* Pending Reviews */}
          <Card>
            <CardHeader title="Pending Reviews" />
            <div className={styles.cardBody}>
              {pending.map(a => (
                <div key={a.id} className={styles.assignItem}>
                  <div className={styles.assignIcon}><IconClipboard size={18} color="var(--orange)" /></div>
                  <div>
                    <div className={styles.assignTitle}>{a.title}</div>
                    <div className={styles.assignDue}>{a.due}</div>
                  </div>
                  <button className={styles.btnReview} onClick={() => navigate(`/student/feedback?assignmentId=${a.id}`)}>Review</button>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Feedback */}
          <Card>
            <CardHeader title="Recent Feedback" />
            <div className={styles.cardBody}>
              {reviews.slice(0, 2).map(r => (
                <div key={r.id} className={styles.revItem}>
                  <Avatar initials={r.initials} color={r.color} />
                  <div className={styles.revBody}>
                    <div className={styles.revTop}>
                      <span className={styles.revName}>{r.reviewer}</span>
                      <span className={styles.revScore}>{r.score}</span>
                    </div>
                    <div className={styles.revStars}>{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</div>
                    <div className={styles.revComment}>{r.comment}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function IconBookOpen({ size = 18, color = 'currentColor' }) {
  return (
    <svg style={{ display: 'inline-flex' }} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
