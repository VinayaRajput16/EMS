// src/layouts/UserLayout.jsx
import { Outlet } from "react-router-dom";
import RequireRole from "../auth/RequireRole";

export default function UserLayout() {
  return (
    <RequireRole role="USER">
      <div className="min-h-screen bg-gray-50">
        <Outlet />
      </div>
    </RequireRole>
  );
}