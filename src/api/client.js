const API_BASE = import.meta.env.VITE_API_BASE || '/api';

function getToken() {
  return localStorage.getItem('peerhub_token');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

// Auth
export async function apiLogin(email, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem('peerhub_token', data.token);
  return data;
}

export async function apiGetMe() {
  return request('/auth/me');
}

export function apiLogout() {
  localStorage.removeItem('peerhub_token');
}

// Projects
export async function apiGetProjects() {
  return request('/projects');
}

export async function apiGetProject(id) {
  return request(`/projects/${id}`);
}

// Reviews
export async function apiGetReviews() {
  return request('/reviews');
}

export async function apiGetPendingReviews() {
  return request('/reviews/pending');
}

export async function apiSubmitReview(reviewData) {
  return request('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  });
}

// Students (instructor)
export async function apiGetStudents() {
  return request('/students');
}

// Assignments
export async function apiGetAssignments() {
  return request('/assignments');
}

export async function apiCreateAssignment(assignmentData) {
  return request('/assignments', {
    method: 'POST',
    body: JSON.stringify(assignmentData),
  });
}

// Settings
export async function apiGetSettings() {
  return request('/settings');
}

export async function apiUpdateSettings(settingsData) {
  return request('/settings', {
    method: 'PUT',
    body: JSON.stringify(settingsData),
  });
}
