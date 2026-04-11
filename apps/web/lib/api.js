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

export const login = (userName, password) =>
  fetcher('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ userName, password }),
  });

export const logout = (token) =>
  fetcher('/auth/logout', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

export const fetchMissions = () => fetcher('/missions');

export const onboardUser = (userName, charType) =>
  fetcher('/users/onboard', {
    method: 'POST',
    body: JSON.stringify({ userName, charType }),
  });

export const getUserProfile = (userName) =>
  fetcher(`/users/me?userName=${encodeURIComponent(userName)}`);

export const verifyMission = (missionId, userName, content) =>
  fetcher(`/missions/${missionId}/verify`, {
    method: 'POST',
    body: JSON.stringify({ userName, content }),
  });

export const getRankings = () => fetcher('/rankings');

export const giftPoints = (from, to, points) =>
  fetcher('/points/gift', {
    method: 'POST',
    body: JSON.stringify({ from, to, points }),
  });
