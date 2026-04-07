import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import { IconDashboard, IconClipboard, IconBarChart, IconSettings } from '../../components/Icons';
import { apiGetAssignments, apiGetAvailableStudents } from '../../api/client';
import styles from './InstructorLayout.module.css';

const TITLES = {
  '/instructor/overview':    'Overview',
  '/instructor/assignments': 'Assignments',
  '/instructor/progress':    'Student Progress',
  '/instructor/settings':    'Settings',
};

export default function InstructorLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);

  useEffect(() => {
    apiGetAssignments().then(setAssignments).catch(() => setAssignments([]));
    apiGetAvailableStudents().then(setAvailableStudents).catch(() => setAvailableStudents([]));
  }, [pathname]);

  const pendingAssignments = useMemo(
    () => assignments.filter(a => String(a.status || '').toLowerCase() === 'pending').length,
    [assignments],
  );

  const navItems = useMemo(() => [
    { path: '/instructor/overview',    label: 'Overview',         icon: <IconDashboard size={16} /> },
    { path: '/instructor/assignments', label: 'Assignments',      icon: <IconClipboard size={16} />, badge: pendingAssignments || undefined },
    { path: '/instructor/progress',    label: 'Student Progress', icon: <IconBarChart size={16} /> },
    { path: '/instructor/settings',    label: 'Settings',         icon: <IconSettings size={16} /> },
  ], [pendingAssignments]);

  const notifications = useMemo(() => {
    const pendingNotifs = assignments
      .filter(a => String(a.status || '').toLowerCase() === 'pending')
      .slice(0, 6)
      .map(a => ({
        id: `assignment-${a.id}`,
        title: `Pending: ${a.reviewer} reviews ${a.reviewing}`,
        meta: `${a.project} · Due ${a.due}`,
        path: '/instructor/assignments',
      }));

    if (availableStudents.length > 0) {
      pendingNotifs.unshift({
        id: 'available-students',
        title: `${availableStudents.length} student(s) available to assign`,
        meta: 'Open Assignments tab to enroll them in your course',
        path: '/instructor/assignments',
      });
    }

    return pendingNotifs;
  }, [assignments, availableStudents.length]);

  return (
    <div className={styles.shell}>
      <Sidebar navItems={navItems} variant="dark" />
      <div className={styles.main}>
        <Topbar
          title={TITLES[pathname] || 'Overview'}
          notifications={notifications}
          storageKey="peerhub_instructor_notifs"
          onNotificationClick={(n) => n.path && navigate(n.path)}
        />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
