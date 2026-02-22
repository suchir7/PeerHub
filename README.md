# PeerHub — Peer Review & Collaboration Platform

**FSAD-PS26 | React + Vite Frontend**

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open http://localhost:5173
```

## 🔐 Demo Credentials

| Role       | Email                          | Password    |
|------------|-------------------------------|-------------|
| Student    | alex@university.edu           | student123  |
| Student    | priya@university.edu          | student123  |
| Instructor | prof.rivera@university.edu    | teach123    |

After login, users are **automatically redirected** to their respective dashboards.

## 📁 Project Structure

```
peerhub/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx               # App entry point
    ├── App.jsx                # Router + route protection
    ├── styles/
    │   └── global.css         # CSS variables, resets, animations
    ├── context/
    │   └── AuthContext.jsx    # Auth state + role-based login
    ├── data/
    │   └── mockData.js        # Mock API data
    ├── components/
    │   ├── UI.jsx / .module.css       # Shared UI components
    │   ├── Sidebar.jsx / .module.css  # Role-aware sidebar nav
    │   ├── Topbar.jsx / .module.css   # Sticky top header
    │   └── ProtectedRoute.jsx         # Route guard
    └── pages/
        ├── Login.jsx / .module.css    # Unified login (auto-redirects by role)
        ├── student/
        │   ├── StudentLayout.jsx      # Shell with sidebar + outlet
        │   ├── StudentDashboard.jsx   # Stats, projects, feedback preview
        │   ├── StudentProjects.jsx    # All project cards
        │   ├── StudentReviews.jsx     # Reviews received
        │   └── StudentFeedback.jsx    # Submit peer review
        └── instructor/
            ├── InstructorLayout.jsx   # Shell with dark sidebar + outlet
            ├── InstructorOverview.jsx # Class stats + leaderboard
            ├── InstructorAssignments.jsx # Review pairings + modal
            ├── InstructorProgress.jsx # Student progress table
            └── InstructorSettings.jsx # Course settings
```

## 🔗 Connecting to Spring Boot

Replace mock data in `src/data/mockData.js` with real API calls:

```js
// Example: fetch projects from Spring Boot
const res = await fetch('http://localhost:8080/api/projects', {
  headers: { Authorization: `Bearer ${token}` }
});
const projects = await res.json();
```

Update `AuthContext.jsx` to POST to `/api/auth/login` and store the JWT token.

## 🎨 Design

- **Fonts:** Playfair Display (headings) + Plus Jakarta Sans (body)
- **Colors:** White/cream base · `#E8622A` orange accent · Ink `#1A1714`
- **Student portal:** Light sidebar
- **Instructor portal:** Dark charcoal sidebar
