// src/pages/organizer/Dashboard.jsx
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function OrganizerDashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get("/events/my").then(res => setEvents(res.data.data));
  }, []);

  return (
    <div>
      <h2 className="text-lg mb-4">Organizer Dashboard</h2>
      <p>Total events: {events.length}</p>
    </div>
  );
}