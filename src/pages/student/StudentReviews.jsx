import { REVIEWS_RECEIVED } from '../../data/mockData';
import { Avatar } from '../../components/UI';
import styles from './StudentReviews.module.css';

export default function StudentReviews() {
  return (
    <div className="page-enter">
      <div className={styles.list}>
        {REVIEWS_RECEIVED.map(r => (
          <div key={r.id} className={styles.card}>
            <div className={styles.scoreRing}>
              <div className={styles.scoreVal}>{r.score}</div>
              <div className={styles.scoreLbl}>Score</div>
            </div>
            <div className={styles.body}>
              <div className={styles.top}>
                <div>
                  <div className={styles.name}>{r.reviewer}</div>
                  <div className={styles.proj}>Reviewed: {r.project}</div>
                </div>
                <Avatar initials={r.initials} color={r.color} />
              </div>
              <div className={styles.stars}>{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</div>
              <p className={styles.comment}>{r.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
