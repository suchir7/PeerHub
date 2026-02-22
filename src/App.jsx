import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';

import StudentLayout    from './pages/student/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProjects  from './pages/student/StudentProjects';
import StudentReviews   from './pages/student/StudentReviews';
import StudentFeedback  from './pages/student/StudentFeedback';

import InstructorLayout      from './pages/instructor/InstructorLayout';
import InstructorOverview    from './pages/instructor/InstructorOverview';
import InstructorAssignments from './pages/instructor/InstructorAssignments';
import InstructorProgress    from './pages/instructor/InstructorProgress';
import InstructorSettings    from './pages/instructor/InstructorSettings';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/"      element={<Navigate to="/login" replace />} />

          {/* Student */}
          <Route
            path="/student"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index                  element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"       element={<StudentDashboard />} />
            <Route path="projects"        element={<StudentProjects />} />
            <Route path="reviews"         element={<StudentReviews />} />
            <Route path="feedback"        element={<StudentFeedback />} />
          </Route>

          {/* Instructor */}
          <Route
            path="/instructor"
            element={
              <ProtectedRoute requiredRole="instructor">
                <InstructorLayout />
              </ProtectedRoute>
            }
          >
            <Route index                    element={<Navigate to="overview" replace />} />
            <Route path="overview"          element={<InstructorOverview />} />
            <Route path="assignments"       element={<InstructorAssignments />} />
            <Route path="progress"          element={<InstructorProgress />} />
            <Route path="settings"          element={<InstructorSettings />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
