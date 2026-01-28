import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { organizerApi } from "../../../api/organizer.api";

export default function SeatCategoryCreate() {
  const navigate = useNavigate();
  const { id: eventId } = useParams();

  const [venueName, setVenueName] = useState("");

  const [name, setName] = useState("");
  const [priority, setPriority] = useState(1);
  const [maxSeats, setMaxSeats] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Load venue ONLY for display
  useEffect(() => {
    organizerApi
      .getVenueByEvent(eventId)
      .then((res) => {
        setVenueName(res.data.data.name);
      })
      .catch(() => {
        setError("Venue must be created before seat categories");
      });
  }, [eventId]);

  async function submit(goNext) {
    setLoading(true);
    setError("");

    try {
      await organizerApi.createSeatCategoryForEvent(eventId, {
        name,
        priority: Number(priority),
        maxSeats: maxSeats ? Number(maxSeats) : null,
      });

      // reset form for next category
      setName("");
      setPriority(1);
      setMaxSeats("");

      if (goNext) {
        navigate(`/organizer/events/${eventId}/tickets`);
      }
    } catch {
      setError("Failed to create seat category");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6">Create Seat Category</h1>

        <p className="text-sm text-gray-600 mb-4">
          Venue: <strong>{venueName || "—"}</strong>
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(false);
          }}
          className="space-y-5"
        >
          <div>
            <label className="block font-medium mb-1">Category Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Priority (Lower = Better seats)
            </label>
            <input
              type="number"
              min="1"
              className="w-full border rounded px-3 py-2"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Max Seats (Optional)
            </label>
            <input
              type="number"
              min="1"
              className="w-full border rounded px-3 py-2"
              value={maxSeats}
              onChange={(e) => setMaxSeats(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(`/organizer/events/${eventId}`)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border rounded"
            >
              {loading ? "Saving..." : "Save & Add Another"}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => submit(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              Save & Go to Tickets
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
