// src/layouts/OrganizerLayout.jsx
import { Outlet, Link } from "react-router-dom";

export default function OrganizerLayout() {
  return (
    <div className="flex">
      <aside className="w-64 p-4 border-r space-y-2">
        <Link to="/organizer/dashboard">Dashboard</Link>
        <Link to="/organizer/events">My Events</Link>
        <Link to="/organizer/venues">Venues</Link>
        <Link to="/organizer/analytics">Analytics</Link>
      </aside>
      <main className="p-6 flex-1">
        <Outlet />
      </main>
    </div>
  );
}