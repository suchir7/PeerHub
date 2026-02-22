import { useAuth } from '../../context/AuthContext';
import { PROJECTS, REVIEWS_RECEIVED, PENDING_REVIEWS } from '../../data/mockData';
import { StatCard, Card, CardHeader, ProgressBar, StatusBadge, Avatar } from '../../components/UI';
import styles from './StudentDashboard.module.css';

export default function StudentDashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="page-enter">
      {/* Welcome Banner */}
      <div className={styles.banner}>
        <div className={styles.bannerContent}>
          <div className={styles.bannerEye}>Student Dashboard</div>
          <div className={styles.bannerName}>Good morning, {firstName}. 👋</div>
          <div className={styles.bannerSub}>You have 2 pending peer reviews this week — keep the momentum going.</div>
        </div>
        <div className={styles.bannerDecor}>📚</div>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        <StatCard icon="📁" value="3" label="Active Projects"  note="1 added this week"  chipColor="chipOrange" />
        <StatCard icon="📝" value="5" label="Reviews Given"    note="↑ 2 this month"     chipColor="chipGreen"  />
        <StatCard icon="⭐" value="88" label="Average Score"   note="↑ 4 pts this week"  chipColor="chipBlue"   />
        <StatCard icon="⏳" value="2" label="Due This Week"    note="Before Feb 24"       chipColor="chipYellow" />
      </div>

      {/* Content Grid */}
      <div className={styles.grid}>
        {/* Projects */}
        <Card>
          <CardHeader title="My Projects" action="View all" />
          <div className={styles.cardBody}>
            {PROJECTS.slice(0, 3).map(p => (
              <div key={p.id} className={styles.projItem}>
                <div className={styles.projTop}>
                  <div>
                    <div className={styles.projName}>{p.name}</div>
                    <div className={styles.projMeta}>👥 {p.members} members · Due {p.due} · {p.reviews} review{p.reviews !== 1 ? 's' : ''}</div>
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
              {PENDING_REVIEWS.map(a => (
                <div key={a.id} className={styles.assignItem}>
                  <div className={styles.assignIcon}>📋</div>
                  <div>
                    <div className={styles.assignTitle}>{a.title}</div>
                    <div className={styles.assignDue}>{a.due}</div>
                  </div>
                  <button className={styles.btnReview}>Review</button>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Feedback */}
          <Card>
            <CardHeader title="Recent Feedback" />
            <div className={styles.cardBody}>
              {REVIEWS_RECEIVED.slice(0, 2).map(r => (
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
