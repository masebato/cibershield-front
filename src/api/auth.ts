import { api } from "./axios";

export const loginRequest = (data: {
  email: string;
  password: string;
}) => api.post("/auth/login", data);

export const registerRequest = (data: any) =>
  api.post("/auth/register", data);