import axios from 'axios';

// Get base API URL from environment, strip trailing slashes, and fallback to local dev backend
const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
export const API_BASE_URL = rawUrl.replace(/\/+$/, '');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach stored token to ensure cross-origin authentication works on all browsers
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('magizhcode_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

/**
 * Helper to construct the full redirect URL for OAuth and test login
 */
export const getAuthRedirectUrl = (path: 'google/login' | 'github/login' | 'dev-login'): string => {
  return `${API_BASE_URL}/auth/${path}`;
};
