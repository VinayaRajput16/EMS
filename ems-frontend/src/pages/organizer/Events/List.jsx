import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { organizerApi } from "../../../api/organizer.api";

export default function OrganizerEventList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    organizerApi.getMyEvents().then(res => {
      setEvents(res.data.data);
    });
  }, []);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-lg">My Events</h2>
        <Link to="create" className="border px-3 py-1">
          Create Event
        </Link>
      </div>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(e => (
            <tr key={e.id}>
              <td>{e.title}</td>
              <td>{e.status}</td>
              <td className="space-x-2">
                <Link to={e.id}>View</Link>
                {e.status === "DRAFT" && (
                  <Link to={`${e.id}/edit`}>Edit</Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
