// src/api/admin.api.js
import api from "./axios";

export const adminApi = {
  listLayouts: () => api.get("/admin/layouts"),
  getLayout: (id) => api.get(`/admin/layouts/${id}`),
  createLayout: (data) => api.post("/admin/layouts", data),
  updateLayout: (id, data) => api.patch(`/admin/layouts/${id}`, data),
  deleteLayout: (id) => api.delete(`/admin/layouts/${id}`),
};