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

export const getUserProfile = (empId) =>
  fetcher(`/users/me?empId=${encodeURIComponent(empId)}`);

export const verifyMission = (missionId, empId, content) =>
  fetcher(`/missions/${missionId}/verify`, {
    method: 'POST',
    body: JSON.stringify({ empId, content }),
  });

export const getRankings = () => fetcher('/rankings');

export const giftPoints = (toEmpId, points) =>
  fetcher('/points/gift', {
    method: 'POST',
    body: JSON.stringify({ to: toEmpId, points }),
  });

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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
