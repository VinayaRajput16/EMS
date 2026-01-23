import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { organizerApi } from "../../../api/organizer.api";

export default function SeatCategoryList() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      const res = await organizerApi.getSeatCategories(eventId);
      if (mounted) {
        setCategories(res.data?.data ?? res.data);
        setLoading(false);
      }
    }

    loadCategories();
    return () => (mounted = false);
  }, [eventId]);

  if (loading) return <div>Loading seat categories...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Seat Categories</h2>
        <button
          className="border px-3 py-1"
          onClick={() =>
            navigate(`/organizer/events/${eventId}/seat-categories/create`)
          }
        >
          Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <p className="text-sm text-gray-600">
          No seat categories created yet.
        </p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr>
              <th>Name</th>
              <th>Capacity</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.capacity}</td>
                <td>{c.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
