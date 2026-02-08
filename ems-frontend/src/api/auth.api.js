// src/api/auth.api.js
import api from "./axios";

export const authApi = {
  // Register new user
  register: (data) =>
    api.post("/auth/register", data),

  // Login
  login: (credentials) =>
    api.post("/auth/login", credentials),

  // Refresh token
  refresh: (refreshToken) =>
    api.post("/auth/refresh", { refreshToken }),
};