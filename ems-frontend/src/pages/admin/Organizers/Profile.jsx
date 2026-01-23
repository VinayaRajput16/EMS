// src/pages/admin/Organizers/Profile.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api/axios";

export default function OrganizerProfile() {
  const { id } = useParams();
  const [organizer, setOrganizer] = useState(null);

  useEffect(() => {
    api.get("/users").then(res => {
      const user = res.data.find(u => u.id === id);
      setOrganizer(user);
    });
  }, [id]);

  if (!organizer) return null;

  return (
    <div className="space-y-2">
      <h2 className="text-lg">Organizer Profile</h2>
      <p>Name: {organizer.name}</p>
      <p>Email: {organizer.email}</p>
      <p>Status: {organizer.is_active ? "Active" : "Blocked"}</p>
    </div>
  );
}
