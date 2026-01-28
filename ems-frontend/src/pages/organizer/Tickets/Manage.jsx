import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { organizerApi } from "../../../api/organizer.api";

export default function OrganizerTicketManage() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();

  const [seatCategories, setSeatCategories] = useState([]);
  const [tickets, setTickets] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1️⃣ Load seat categories for this event
  useEffect(() => {
    organizerApi
      .getSeatCategoriesByEvent(eventId)
      .then((res) => {
        setSeatCategories(res.data.data || []);
      })
      .catch((err) => {
        console.error("Failed to load seat categories:", err);
        setSeatCategories([]);
      });
  }, [eventId]);

  // 2️⃣ Load tickets for this event
  useEffect(() => {
    loadTickets();
  }, [eventId]);

  function loadTickets() {
    organizerApi
      .getTicketsByEvent(eventId)
      .then((res) => {
        setTickets(res.data.data || []);
      })
      .catch((err) => {
        console.error("Failed to load tickets:", err);
        setTickets([]);
      });
  }

  function toggleCategory(id) {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  async function createTicket(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await organizerApi.createTicket(eventId, {
        name,
        price: Number(price),
        seatCategoryIds: selectedCategories, // ✅ optional array
      });

      // ✅ Reset form
      setName("");
      setPrice("");
      setSelectedCategories([]);

      // ✅ Reload tickets
      loadTickets();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ticket");
      console.error("Create ticket error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteTicket(ticketId) {
    if (!confirm("Are you sure you want to delete this ticket?")) return;

    try {
      await organizerApi.deleteTicket(ticketId);
      loadTickets();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete ticket");
      console.error("Delete ticket error:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6">Manage Tickets</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="text-red-900 font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* CREATE TICKET FORM */}
        <form onSubmit={createTicket} className="space-y-5 mb-10">
          <div>
            <label className="block font-medium mb-1">Ticket Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="e.g., VIP, General Admission"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Price (₹)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full border rounded px-3 py-2"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          {/* Seat category mapping - OPTIONAL */}
          {seatCategories.length > 0 && (
            <div>
              <label className="block font-medium mb-2">
                Seat Categories (Optional)
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Select which seat categories this ticket type can access
              </p>

              <div className="space-y-2 border rounded p-3 bg-gray-50">
                {seatCategories.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(c.id)}
                      onChange={() => toggleCategory(c.id)}
                      className="w-4 h-4"
                    />
                    <span className="font-medium">{c.name}</span>
                    <span className="text-sm text-gray-600">
                      (Priority: {c.priority})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setName("");
                setPrice("");
                setSelectedCategories([]);
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Add Ticket"}
            </button>
          </div>
        </form>

        {/* EXISTING TICKETS LIST */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Created Tickets</h2>

          {tickets.length === 0 ? (
            <p className="text-gray-600 text-center py-8 border rounded bg-gray-50">
              No tickets created yet. Add your first ticket above.
            </p>
          ) : (
            <div className="space-y-3">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  className="border rounded p-4 flex justify-between items-start hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{t.name}</h3>
                      <span className="text-indigo-600 font-bold">
                        ₹{t.price}
                      </span>
                    </div>

                    {/* Display seat category mappings if they exist */}
                    {t.mappings && t.mappings.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-1">
                          Valid for categories:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {t.mappings.map((mapping) => (
                            <span
                              key={mapping.id}
                              className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded"
                            >
                              {mapping.seatCategory.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => deleteTicket(t.id)}
                    className="ml-4 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* NAVIGATION */}
        <div className="flex justify-between pt-8 border-t mt-8">
          <button
            onClick={() => navigate(`/organizer/events/${eventId}/venue`)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            ← Back to Venue
          </button>
          <button
            onClick={() => navigate(`/organizer/events/${eventId}/publish`)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Done & Review Event →
          </button>
        </div>
      </div>
    </div>
  );
}