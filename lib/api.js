export const login = (empId, password) =>
  fetcher('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ empId, password }),
  });

export const logout = (token) =>
  fetcher('/auth/logout', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

export const fetchMissions = () => fetcher('/missions');

export const onboardUser = (userName, empId, charType, password) =>
  fetcher('/users/onboard', {
    method: 'POST',
    body: JSON.stringify({ userName, empId, charType, password }),
  });

export const deleteAccount = () =>
  fetcher('/users/delete', {
    method: 'DELETE',
  });

export const getUserProfile = () => fetcher('/users/me');

export const updateProfile = (data) =>
  fetcher('/users/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

export const verifyMission = (missionId, content, points, carbon, image) =>
  fetcher(`/missions/${missionId}/verify`, {
    method: 'POST',
    body: JSON.stringify({ content, points, carbon, image }),
  });

export const getRankings = () => fetcher('/rankings');

export const giftPoints = (toEmpId, points) =>
  fetcher('/points/gift', {
    method: 'POST',
    body: JSON.stringify({ to: toEmpId, points }),
  });

// 관리자용 API
export const adminResetUser = (empId) =>
  fetcher(`/admin/users/${empId}/reset`, {
    method: 'POST',
  });

export const adminDeleteUser = (empId) =>
  fetcher(`/admin/users/${empId}/delete`, {
    method: 'DELETE',
  });

const API_BASE_URL = '/api';

async function fetcher(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('eko_token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    const errorInfo = await res.json().catch(() => ({ message: 'No error info' }));
    error.info = errorInfo;
    error.status = res.status;
    throw error;
  }

  return res.json();
}
