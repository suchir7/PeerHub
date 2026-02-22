import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import styles from './InstructorLayout.module.css';

const NAV = [
  { path: '/instructor/overview',    label: 'Overview',         icon: '⊞' },
  { path: '/instructor/assignments', label: 'Assignments',      icon: '📋', badge: 2 },
  { path: '/instructor/progress',    label: 'Student Progress', icon: '📊' },
  { path: '/instructor/settings',    label: 'Settings',         icon: '⚙️' },
];

const TITLES = {
  '/instructor/overview':    'Overview',
  '/instructor/assignments': 'Assignments',
  '/instructor/progress':    'Student Progress',
  '/instructor/settings':    'Settings',
};

export default function InstructorLayout() {
  const { pathname } = useLocation();
  return (
    <div className={styles.shell}>
      <Sidebar navItems={NAV} variant="dark" />
      <div className={styles.main}>
        <Topbar title={TITLES[pathname] || 'Overview'} />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
