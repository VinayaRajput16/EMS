// src/pages/admin/Events/List.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/axios";

export default function AdminEventList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get("/api/admin/events").then(res => setEvents(res.data.data));
  }, []);

  return (
    <div>
      <h2 className="text-lg mb-4">Events (Read Only)</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th>Title</th>
            <th>Organizer</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(e => (
            <tr key={e.id}>
              <td>{e.title}</td>
              <td>{e.organizer?.name}</td>
              <td>{e.status}</td>
              <td>
                <Link to={e.id}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
