// src/pages/admin/Organizers/List.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../api/axios";

export default function OrganizerList() {
  const [organizers, setOrganizers] = useState([]);

  useEffect(() => {
    api.get("/users").then(res => setOrganizers(res.data));
  }, []);

  async function toggleBlock(id) {
    await api.patch(`/users/${id}/block`);
    const res = await api.get("/users");
    setOrganizers(res.data);
  }

  return (
    <div>
      <h2 className="text-lg mb-4">Organizers</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {organizers.map(o => (
            <tr key={o.id}>
              <td>{o.name}</td>
              <td>{o.email}</td>
              <td>{o.is_active ? "Active" : "Blocked"}</td>
              <td className="space-x-2">
                <Link to={o.id}>View</Link>
                <button onClick={() => toggleBlock(o.id)} className="border px-2">
                  {o.is_active ? "Block" : "Unblock"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}