const API_BASE = 'http://localhost:3000';

function setTokens(data) {
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
}

function getAccessToken() {
  return localStorage.getItem('accessToken');
}

async function fetchWithAuth(url, options = {}) {
  const token = getAccessToken();
  return fetch(API_BASE + url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });
}
