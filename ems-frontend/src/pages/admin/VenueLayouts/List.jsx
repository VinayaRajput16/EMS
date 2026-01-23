// src/pages/admin/VenueLayouts/List.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../../api/admin.api";

export default function LayoutList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    adminApi.listLayouts().then(res => setItems(res.data.data));
  }, []);

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-lg">Venue Layout Templates</h2>
        <Link className="border px-3 py-1" to="create">Create</Link>
      </div>
      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th><th>Type</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(l => (
            <tr key={l.id}>
              <td>{l.name}</td>
              <td>{l.layoutType}</td>
              <td className="space-x-2">
                <Link to={l.id}>View</Link>
                <Link to={`${l.id}/edit`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}