export const PROJECTS = [
  { id: 1, name: 'E-Commerce UI Redesign',    members: 4, due: 'Feb 24', progress: 72, reviews: 3, status: 'progress', desc: 'Modern storefront redesign built with React & Spring Boot.' },
  { id: 2, name: 'Machine Learning Pipeline',  members: 3, due: 'Mar 02', progress: 45, reviews: 1, status: 'pending',  desc: 'End-to-end ML pipeline with data preprocessing & model eval.' },
  { id: 3, name: 'REST API Documentation',     members: 5, due: 'Feb 20', progress: 92, reviews: 5, status: 'done',     desc: 'Swagger/OpenAPI docs for a production Spring Boot backend.' },
  { id: 4, name: 'Mobile App Prototype',       members: 2, due: 'Mar 10', progress: 28, reviews: 0, status: 'pending',  desc: 'React Native prototype for a student task management app.' },
];

export const REVIEWS_RECEIVED = [
  { id: 1, reviewer: 'Priya S.',  initials: 'PS', score: 92, stars: 5, project: 'E-Commerce UI Redesign', comment: 'Excellent documentation and code readability. The state management pattern is well thought out. Great use of component composition throughout the project.', color: '#2655A6' },
  { id: 2, reviewer: 'Jordan K.', initials: 'JK', score: 88, stars: 4, project: 'E-Commerce UI Redesign', comment: 'Solid architecture choices. The API layer is clean. Consider adding error boundary handling in the React components for better resilience.',               color: '#2A7A45' },
  { id: 3, reviewer: 'Sam C.',    initials: 'SC', score: 74, stars: 3, project: 'REST API Documentation', comment: 'Good effort overall. Needs better test coverage and the database queries could be optimised further to reduce response times.',                        color: '#D97706' },
];

export const PENDING_REVIEWS = [
  { id: 1, title: 'ML Pipeline — Team Sigma',  due: 'Due Feb 21' },
  { id: 2, title: 'Mobile App — Team Gamma',   due: 'Due Feb 26' },
];

export const STUDENTS = [
  { name: 'Maya Patel',    initials: 'MP', team: 'Team Sigma', submissions: 2, reviews: 2, score: 95, color: '#7C3AED' },
  { name: 'Priya Sharma',  initials: 'PS', team: 'Team Beta',  submissions: 2, reviews: 3, score: 91, color: '#2655A6' },
  { name: 'Alex Martinez', initials: 'AM', team: 'Team Alpha', submissions: 3, reviews: 2, score: 88, color: '#E8622A' },
  { name: 'Sam Chen',      initials: 'SC', team: 'Team Delta', submissions: 1, reviews: 2, score: 82, color: '#2A7A45' },
  { name: 'Jordan Kim',    initials: 'JK', team: 'Team Alpha', submissions: 3, reviews: 1, score: 74, color: '#D97706' },
];

export const ASSIGNMENTS = [
  { reviewer: 'Alex M.',   reviewing: 'Priya S.',   project: 'ML Pipeline',    due: 'Feb 21', status: 'pending'  },
  { reviewer: 'Jordan K.', reviewing: 'Sam C.',     project: 'REST API',        due: 'Feb 18', status: 'done'     },
  { reviewer: 'Sam C.',    reviewing: 'Alex M.',    project: 'E-Commerce UI',   due: 'Feb 24', status: 'progress' },
  { reviewer: 'Priya S.',  reviewing: 'Maya P.',    project: 'Mobile App',      due: 'Feb 26', status: 'pending'  },
  { reviewer: 'Maya P.',   reviewing: 'Jordan K.',  project: 'REST API',        due: 'Feb 20', status: 'done'     },
];
