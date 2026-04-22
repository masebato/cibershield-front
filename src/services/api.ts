import axios from 'axios';

// TODO: Replace with actual API base URL from environment variable
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach Bearer token from storage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token') ?? sessionStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
      // TODO: Trigger global logout via auth store event
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;
