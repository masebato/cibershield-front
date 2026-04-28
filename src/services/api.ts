import axios from 'axios';
import { clearTokens, readAccessToken } from './authStorage';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

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
    const token = readAccessToken();
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
      clearTokens();
      localStorage.removeItem('cybershield-auth');
      sessionStorage.removeItem('cybershield-auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;
