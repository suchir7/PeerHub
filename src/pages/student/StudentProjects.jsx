import { PROJECTS } from '../../data/mockData';
import { StatusBadge, ProgressBar } from '../../components/UI';
import styles from './StudentProjects.module.css';

const COLORS = ['#E8622A','#2655A6','#2A7A45','#7C3AED'];
const SOFT    = ['#FF9A6C','#60A5FA','#4ADE80','#A78BFA'];

export default function StudentProjects() {
  return (
    <div className="page-enter">
      <div className={styles.grid}>
        {PROJECTS.map((p, i) => (
          <div key={p.id} className={styles.card}>
            <div
              className={styles.cardTop}
              style={{ background: `linear-gradient(135deg, ${COLORS[i]} 0%, ${SOFT[i]} 100%)` }}
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
    </div>
  );
}
