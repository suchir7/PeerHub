import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Sidebar.module.css';

export default function Sidebar({ navItems, variant = 'light' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`${styles.sidebar} ${variant === 'dark' ? styles.dark : ''}`}>
      <div className={styles.header}>
        <div className={styles.logo}>
          Peer<em className={styles.logoAccent}>Hub</em>
        </div>
        <div className={styles.tagline}>
          {variant === 'dark' ? 'Instructor Portal' : 'Student Platform'} · FSAD-PS26
        </div>
      </div>

      <div className={styles.userCard}>
        <div className={styles.avatar}>{user?.initials}</div>
        <div>
          <div className={styles.userName}>{user?.name}</div>
          <div className={styles.userRole}>
            {variant === 'dark' ? '👨‍🏫 Instructor' : '🎓 Student'}
          </div>
        </div>
      </div>

      <nav className={styles.nav}>
        <div className={styles.navSection}>Navigation</div>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {item.label}
            {item.badge && <span className={styles.navBadge}>{item.badge}</span>}
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
