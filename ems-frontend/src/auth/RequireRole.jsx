// src/auth/RequireRole.jsx
import { Navigate } from "react-router-dom";
import { getUserFromToken } from "./useAuth";

export default function RequireRole({ role, children }) {
  const user = getUserFromToken();
  if (!user || user.role !== role) return <Navigate to="/admin/login" />;
  return children;
}