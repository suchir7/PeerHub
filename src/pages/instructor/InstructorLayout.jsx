import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import { IconDashboard, IconClipboard, IconBarChart, IconSettings } from '../../components/Icons';
import styles from './InstructorLayout.module.css';

const NAV = [
  { path: '/instructor/overview',    label: 'Overview',         icon: <IconDashboard size={16} /> },
  { path: '/instructor/assignments', label: 'Assignments',      icon: <IconClipboard size={16} />, badge: 2 },
  { path: '/instructor/progress',    label: 'Student Progress', icon: <IconBarChart size={16} /> },
  { path: '/instructor/settings',    label: 'Settings',         icon: <IconSettings size={16} /> },
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
