const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'https://peerhub-backend-n6ib.onrender.com/api').replace(/\/$/, '');

function getToken() {
  return localStorage.getItem('peerhub_token');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  let res;
  try {
    res = await fetch(`${API_BASE}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw new Error('Network error. Please check your connection and API URL.');
  } finally {
    clearTimeout(timeout);
  }

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

// Auth
export async function apiLogin(email, password, captchaToken) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, captchaToken }),
  });
  localStorage.setItem('peerhub_token', data.token);
  return data;
}

export async function apiSignup(signupData) {
  const data = await request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(signupData),
  });
  localStorage.setItem('peerhub_token', data.token);
  return data;
}

export async function apiGoogleAuth(idToken, mode, role, captchaToken) {
  const data = await request('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ idToken, mode, role, captchaToken }),
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

export async function apiCreateProject(projectData) {
  return request('/projects', {
    method: 'POST',
    body: JSON.stringify(projectData),
  });
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

export async function apiGetAvailableStudents() {
  return request('/students/available');
}

export async function apiAssignStudent(studentId, payload) {
  return request(`/students/${studentId}/assign`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function apiGetStudentProfile() {
  return request('/students/me-profile');
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
