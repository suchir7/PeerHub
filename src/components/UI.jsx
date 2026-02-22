import styles from './UI.module.css';

export function StatusBadge({ status }) {
  const map = {
    done:     { cls: styles.done,     label: 'Done' },
    progress: { cls: styles.progress, label: 'In Progress' },
    pending:  { cls: styles.pending,  label: 'Pending' },
  };
  const { cls, label } = map[status] || map.pending;
  return <span className={`${styles.badge} ${cls}`}>{label}</span>;
}

export function ProgressBar({ value, done }) {
  return (
    <div className={styles.pbTrack}>
      <div
        className={`${styles.pbFill} ${done ? styles.pbDone : ''}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function StatCard({ icon, value, label, note, chipColor }) {
  return (
    <div className={styles.statCard}>
      <div className={`${styles.statChip} ${styles[chipColor]}`}>{icon}</div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
      {note && <div className={styles.statNote}>{note}</div>}
    </div>
  );
}

export function Card({ children, className = '' }) {
  return <div className={`${styles.card} ${className}`}>{children}</div>;
}

export function CardHeader({ title, action, onAction }) {
  return (
    <div className={styles.cardHeader}>
      <div className={styles.cardTitle}>{title}</div>
      {action && <span className={styles.cardAction} onClick={onAction}>{action}</span>}
    </div>
  );
}

export function Avatar({ initials, color, size = 36 }) {
  return (
    <div
      className={styles.avatar}
      style={{
        width: size, height: size,
        background: color + '22', color,
        fontSize: size * 0.28,
      }}
    >
      {initials}
    </div>
  );
}

export function StarRating({ value, onChange }) {
  const arr = [1, 2, 3, 4, 5];
  return (
    <div className={styles.stars}>
      {arr.map(s => (
        <button
          key={s}
          className={styles.starBtn}
          style={{ color: s <= value ? '#D97706' : '#E0DDD9' }}
          onClick={() => onChange && onChange(s)}
        >★</button>
      ))}
    </div>
  );
}
