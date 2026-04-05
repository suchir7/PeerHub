# PeerHub — Peer Review & Collaboration Platform

**FSAD-PS26 | React + Vite Frontend | Node.js + Express Backend**

## Getting Started

```bash
# 1. Install frontend dependencies
npm install

# 2. Install backend dependencies
cd server && npm install && cd ..

# 3. Start the backend server (port 3001)
cd server && node index.js

# 4. In a new terminal, start the Vite dev server (port 5173)
npm run dev

# 5. Open http://localhost:5173
```

## Demo Credentials

| Role       | Email                          | Password    |
|------------|-------------------------------|-------------|
| Student    | alex@university.edu           | student123  |
| Student    | priya@university.edu          | student123  |
| Instructor | prof.rivera@university.edu    | teach123    |

After login, users are **automatically redirected** to their respective dashboards.

## Architecture

### Frontend (React + Vite)
- **Framework**: React 18 with React Router v6
- **Styling**: CSS Modules + CSS custom properties
- **Icons**: Custom SVG icon components (no emoji dependencies)
- **API Client**: Fetch-based client with JWT token management
- **Dev Proxy**: Vite proxies `/api` requests to the Express backend

### Backend (Node.js + Express)
- **Auth**: JWT-based authentication with bcrypt password support
- **Data Store**: JSON file-based storage (`server/data/db.json`)
- **CORS**: Configured for Vite dev server origins
- **Role Guards**: Middleware for instructor-only endpoints

### API Endpoints

| Method | Endpoint              | Auth | Description                    |
|--------|-----------------------|------|--------------------------------|
| POST   | `/api/auth/login`     | No   | Login, returns JWT token       |
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
├── vite.config.js          # Dev proxy → backend
├── package.json
├── server/
│   ├── index.js            # Express entry point
│   ├── package.json
│   ├── db.js               # JSON file read/write helpers
│   ├── middleware/
│   │   └── auth.js         # JWT auth + role guard middleware
│   ├── routes/
│   │   ├── auth.js         # Login + /me endpoints
│   │   ├── projects.js     # Projects CRUD
│   │   ├── reviews.js      # Reviews + submit
│   │   ├── students.js     # Student list (instructor)
│   │   ├── assignments.js  # Assignment management
│   │   └── settings.js     # Course settings
│   └── data/
│       └── db.json         # JSON data store
└── src/
    ├── main.jsx            # App entry point
    ├── App.jsx             # Router + route protection
    ├── api/
    │   └── client.js       # API client with JWT management
    ├── styles/
    │   └── global.css      # CSS variables, resets, animations
    ├── context/
    │   └── AuthContext.jsx  # Auth state + API-based login
    ├── data/
    │   └── mockData.js     # Legacy mock data (unused)
    ├── components/
    │   ├── Icons.jsx        # SVG icon components
    │   ├── UI.jsx / .css    # Shared UI components
    │   ├── Sidebar.jsx / .css
    │   ├── Topbar.jsx / .css
    │   └── ProtectedRoute.jsx
    └── pages/
        ├── Login.jsx / .css
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
