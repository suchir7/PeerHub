import { IconBell } from './Icons';
import styles from './Topbar.module.css';

export default function Topbar({ title }) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <header className={styles.topbar}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.right}>
        <span className={styles.date}>{today}</span>
        <div className={styles.notifBtn}>
          <IconBell size={18} />
          <span className={styles.notifDot} />
        </div>
      </div>
    </header>
  );
}
