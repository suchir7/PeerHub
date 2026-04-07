import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import { IconDashboard, IconFolder, IconStar, IconMessageSquare } from '../../components/Icons';
import { apiGetPendingReviews, apiGetReviews } from '../../api/client';
import styles from './StudentLayout.module.css';

const TITLES = {
  '/student/dashboard': 'Dashboard',
  '/student/projects':  'My Projects',
  '/student/reviews':   'Reviews Received',
  '/student/feedback':  'Give Feedback',
};

export default function StudentLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [pending, setPending] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    apiGetPendingReviews().then(setPending).catch(() => setPending([]));
    apiGetReviews().then(setReviews).catch(() => setReviews([]));
  }, [pathname]);

  const navItems = useMemo(() => [
    { path: '/student/dashboard', label: 'Dashboard',        icon: <IconDashboard size={16} /> },
    { path: '/student/projects',  label: 'My Projects',      icon: <IconFolder size={16} /> },
    { path: '/student/reviews',   label: 'Reviews Received', icon: <IconStar size={16} />, badge: reviews.length || undefined },
    { path: '/student/feedback',  label: 'Give Feedback',    icon: <IconMessageSquare size={16} />, badge: pending.length || undefined },
  ], [reviews.length, pending.length]);

  const notifications = useMemo(() => {
    const pendingNotifs = pending.slice(0, 5).map(p => ({
      id: `pending-${p.id}`,
      title: `Review due: ${p.title}`,
      meta: p.due,
      path: `/student/feedback?assignmentId=${p.id}`,
    }));
    const reviewNotifs = reviews.slice(0, 3).map(r => ({
      id: `review-${r.id}`,
      title: `New review received for ${r.project}`,
      meta: `${r.reviewer} · Score ${r.score}`,
      path: '/student/reviews',
    }));
    return [...pendingNotifs, ...reviewNotifs];
  }, [pending, reviews]);

  return (
    <div className={styles.shell}>
      <Sidebar navItems={navItems} variant="light" />
      <div className={styles.main}>
        <Topbar
          title={TITLES[pathname] || 'Dashboard'}
          notifications={notifications}
          storageKey="peerhub_student_notifs"
          onNotificationClick={(n) => n.path && navigate(n.path)}
        />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
