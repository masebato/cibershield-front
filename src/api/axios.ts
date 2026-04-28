import axios from "axios";

export const api = axios.create({
  baseURL: "https://cibershield-production.up.railway.app/api",
});

// interceptor para token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});