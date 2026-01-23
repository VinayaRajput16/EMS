// src/pages/admin/Events/Details.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api/axios";

export default function AdminEventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    api.get(`/api/admin/events/${id}`).then(res => setEvent(res.data.data));
  }, [id]);

  if (!event) return null;

  return (
    <div className="space-y-2">
      <h2 className="text-lg">{event.title}</h2>
      <p>Status: {event.status}</p>
      <p>Organizer: {event.organizer?.name}</p>
      <p>Tickets: {event.tickets?.length}</p>
      <p>Orders: {event.orders?.length}</p>
    </div>
  );
}
