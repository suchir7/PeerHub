# PeerHub — Peer Review & Collaboration Platform

React + Vite frontend with a Spring Boot backend.

## Getting Started

1. Frontend:

```bash
npm install
npm run dev
```

2. Backend:

```bash
cd peerhub-backend
./mvnw.cmd spring-boot:run
```

## Auth Features

- Email/password sign in
- Email/password sign up
- Google sign in and sign up
- CAPTCHA challenge before sign in

Users are redirected to dashboards based on role after successful auth.

## Architecture

### Frontend (React + Vite)
- **Framework**: React 18 with React Router v6
- **Styling**: CSS Modules + CSS custom properties
- **Icons**: Custom SVG icon components (no emoji dependencies)
- **API Client**: Fetch-based client with JWT token management
- **Dev Proxy**: Vite proxies `/api` requests to the Express backend

### Backend (Spring Boot)
- **Auth**: JWT-based authentication with BCrypt password hashing
- **Data Store**: MySQL via Spring Data JPA
- **CORS**: Configured for frontend origins
- **Role Guards**: Spring Security + method-level checks

### API Endpoints

| Method | Endpoint              | Auth | Description                    |
|--------|-----------------------|------|--------------------------------|
| POST   | `/api/auth/login`     | No   | Login, returns JWT token       |
| POST   | `/api/auth/signup`    | No   | Signup, returns JWT token      |
| POST   | `/api/auth/google`    | No   | Google auth, returns JWT token |
| GET    | `/api/auth/me`        | Yes  | Get current user from token    |
| GET    | `/api/projects`       | Yes  | List all projects              |
| GET    | `/api/projects/:id`   | Yes  | Get project by ID              |
| GET    | `/api/reviews`        | Yes  | List received reviews          |
| GET    | `/api/reviews/pending`| Yes  | List pending reviews           |
| POST   | `/api/reviews`        | Yes  | Submit a new review            |
| GET    | `/api/students`       | Yes* | List students (instructor)     |
| GET    | `/api/assignments`    | Yes  | List review assignments        |
| POST   | `/api/assignments`    | Yes* | Create assignment (instructor) |
| GET    | `/api/settings`       | Yes  | Get course settings            |
| PUT    | `/api/settings`       | Yes* | Update settings (instructor)   |

*\* = Instructor role required*

## Project Structure

```
peerhub/
├── index.html
├── vite.config.js
├── package.json
├── peerhub-backend/
│   └── src/main/java/com/peerhub/
└── src/
    ├── main.jsx            # App entry point
    ├── App.jsx             # Router + route protection
    ├── api/
    │   └── client.js       # API client with JWT management
    ├── styles/
    │   └── global.css      # CSS variables, resets, animations
    ├── context/
    │   └── AuthContext.jsx  # Auth state + API-based login/signup
    ├── components/
    │   ├── Icons.jsx        # SVG icon components
    │   ├── UI.jsx / .css    # Shared UI components
    │   ├── Sidebar.jsx / .css
    │   ├── Topbar.jsx / .css
    │   └── ProtectedRoute.jsx
    └── pages/
        ├── Login.jsx / .css
        ├── Signup.jsx / .css
        ├── student/
        │   ├── StudentLayout.jsx
        │   ├── StudentDashboard.jsx
        │   ├── StudentProjects.jsx
        │   ├── StudentReviews.jsx
        │   └── StudentFeedback.jsx
        └── instructor/
            ├── InstructorLayout.jsx
            ├── InstructorOverview.jsx
            ├── InstructorAssignments.jsx
            ├── InstructorProgress.jsx
            └── InstructorSettings.jsx
```
