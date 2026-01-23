// src/layouts/AdminLayout.jsx
import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex">
      <aside className="w-64 p-4 border-r">
        <nav className="space-y-2">
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/venue-layouts">Venue Layouts</Link>
          <Link to="/admin/events">Events</Link>
          <Link to="/admin/organizers">Organizers</Link>
          <Link to="/admin/analytics">Analytics</Link>
        </nav>
      </aside>
      <main className="p-6 flex-1">
        <Outlet />
      </main>
    </div>
  );
}