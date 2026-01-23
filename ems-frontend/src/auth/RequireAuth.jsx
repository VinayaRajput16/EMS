// src/auth/RequireAuth.jsx
import { Navigate } from "react-router-dom";
import { getUserFromToken } from "./useAuth";

export default function RequireAuth({ children }) {
  const user = getUserFromToken();
  if (!user) return <Navigate to="/admin/login" />;
  return children;
}