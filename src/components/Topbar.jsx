import { useEffect, useMemo, useState } from 'react';
import { IconBell } from './Icons';
import styles from './Topbar.module.css';

export default function Topbar({ title, notifications = [], storageKey = 'peerhub_notif' }) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      setReadIds(raw ? JSON.parse(raw) : []);
    } catch {
      setReadIds([]);
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(readIds));
    } catch {
      // Ignore storage errors and keep notifications functional in-memory.
    }
  }, [readIds, storageKey]);

  const unreadCount = useMemo(
    () => notifications.filter(n => !readIds.includes(n.id)).length,
    [notifications, readIds],
  );

  const markAllRead = () => {
    setReadIds(notifications.map(n => n.id));
  };

  return (
    <header className={styles.topbar}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.right}>
        <span className={styles.date}>{today}</span>
        <div className={styles.notifWrap}>
          <button className={styles.notifBtn} onClick={() => setOpen(v => !v)}>
            <IconBell size={18} />
            {unreadCount > 0 && <span className={styles.notifDot}>{unreadCount}</span>}
          </button>
          {open && (
            <div className={styles.panel}>
              <div className={styles.panelHead}>
                <span>Notifications</span>
                <button className={styles.markBtn} onClick={markAllRead}>Mark all read</button>
              </div>
              <div className={styles.panelBody}>
                {notifications.length === 0 && <div className={styles.empty}>No notifications right now.</div>}
                {notifications.map(n => (
                  <div key={n.id} className={`${styles.item} ${readIds.includes(n.id) ? styles.itemRead : ''}`}>
                    <div className={styles.itemTitle}>{n.title}</div>
                    <div className={styles.itemMeta}>{n.meta}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
