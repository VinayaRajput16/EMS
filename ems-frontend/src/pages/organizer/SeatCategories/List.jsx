// src/pages/organizer/SeatCategories/List.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { organizerApi } from "../../../api/organizer.api";

export default function SeatCategoryList() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      try {
        const res = await organizerApi.getSeatCategoriesByEvent(eventId);
        if (mounted) {
          setCategories(res.data.data);
        }
      } catch {
        if (mounted) {
          setError("Failed to load seat categories");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadCategories();
    return () => {
      mounted = false;
    };
  }, [eventId]);

  if (loading) {
    return <div className="p-6">Loading seat categories...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Seat Categories</h1>

        <button
          onClick={() =>
            navigate(`/organizer/events/${eventId}/seat-categories/create`)
          }
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Add Category
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">
          {error}
        </div>
      )}

      {categories.length === 0 ? (
        <p className="text-gray-600">
          No seat categories created yet.
        </p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2 text-left">Name</th>
              <th className="border px-3 py-2 text-left">Priority</th>
              <th className="border px-3 py-2 text-left">Max Seats</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td className="border px-3 py-2">{c.name}</td>
                <td className="border px-3 py-2">{c.priority}</td>
                <td className="border px-3 py-2">
                  {c.maxSeats ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex justify-end pt-4">
        <button
          onClick={() =>
            navigate(`/organizer/events/${eventId}/tickets`)
          }
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Continue to Tickets
        </button>
      </div>
    </div>
  );
}
