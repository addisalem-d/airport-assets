import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({ 
  baseURL: API_URL,
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add auth token to every request - check localStorage each time
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('🔐 Request to', config.url, 'Token present:', !!token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle 401 responses - but only log out if we're sure auth is needed
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect to login if we have a token (meaning it expired)
      // Don't redirect if no token (user should go to login naturally)
      if (localStorage.getItem('token')) {
        console.warn('⚠️ 401 Unauthorized - token expired, clearing and redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);