import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import styles from './StudentLayout.module.css';

const NAV = [
  { path: '/student/dashboard', label: 'Dashboard',        icon: '⊞' },
  { path: '/student/projects',  label: 'My Projects',      icon: '📁' },
  { path: '/student/reviews',   label: 'Reviews Received', icon: '⭐', badge: 3 },
  { path: '/student/feedback',  label: 'Give Feedback',    icon: '💬', badge: 2 },
];

const TITLES = {
  '/student/dashboard': 'Dashboard',
  '/student/projects':  'My Projects',
  '/student/reviews':   'Reviews Received',
  '/student/feedback':  'Give Feedback',
};

export default function StudentLayout() {
  const { pathname } = useLocation();
  return (
    <div className={styles.shell}>
      <Sidebar navItems={NAV} variant="light" />
      <div className={styles.main}>
        <Topbar title={TITLES[pathname] || 'Dashboard'} />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
