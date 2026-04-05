import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import { IconDashboard, IconFolder, IconStar, IconMessageSquare } from '../../components/Icons';
import styles from './StudentLayout.module.css';

const NAV = [
  { path: '/student/dashboard', label: 'Dashboard',        icon: <IconDashboard size={16} /> },
  { path: '/student/projects',  label: 'My Projects',      icon: <IconFolder size={16} /> },
  { path: '/student/reviews',   label: 'Reviews Received', icon: <IconStar size={16} />, badge: 3 },
  { path: '/student/feedback',  label: 'Give Feedback',    icon: <IconMessageSquare size={16} />, badge: 2 },
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
