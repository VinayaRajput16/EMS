// src/pages/organizer/Events/Publish.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { organizerApi } from "../../../api/organizer.api";

export default function OrganizerEventPublish() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [venue, setVenue] = useState(null);
  const [seatCategories, setSeatCategories] = useState([]);
  const [tickets, setTickets] = useState([]);

  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");

  // Load everything needed for validation
  useEffect(() => {
    async function load() {
      try {
        const eventRes = await organizerApi.getEventById(eventId);
        setEvent(eventRes.data.data);

        const venueRes = await organizerApi.getVenueByEvent(eventId);
        setVenue(venueRes.data.data);

        const scRes = await organizerApi.getSeatCategoriesByEvent(eventId);
        setSeatCategories(scRes.data.data);

        const ticketRes = await organizerApi.getTicketsByEvent(eventId);
        setTickets(ticketRes.data.data);
      } catch {
        setError("Failed to load publish prerequisites");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [eventId]);

  async function publish() {
    setPublishing(true);
    setError("");

    try {
      await organizerApi.publishEvent(eventId);
      navigate(`/organizer/events`);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Publish failed. Please complete all steps."
      );
    } finally {
      setPublishing(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading…
      </div>
    );
  }

  const canPublish =
    venue &&
    seatCategories.length > 0 &&
    tickets.length > 0 &&
    event?.status === "DRAFT";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6">Publish Event</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* SUMMARY */}
        <div className="space-y-3 mb-6">
          <p>
            <strong>Event:</strong> {event.title}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span className="font-semibold">{event.status}</span>
          </p>
          <p>
            <strong>Venue:</strong>{" "}
            {venue ? venue.name : "❌ Not created"}
          </p>
          <p>
            <strong>Seat Categories:</strong>{" "}
            {seatCategories.length || "❌ None"}
          </p>
          <p>
            <strong>Tickets:</strong>{" "}
            {tickets.length || "❌ None"}
          </p>
        </div>

        {/* VALIDATION HINTS */}
        {!canPublish && (
          <div className="bg-yellow-100 text-yellow-800 p-3 rounded mb-6">
            Complete all required steps before publishing:
            <ul className="list-disc pl-5 mt-2">
              {!venue && <li>Create venue</li>}
              {seatCategories.length === 0 && <li>Create seat categories</li>}
              {tickets.length === 0 && <li>Create tickets</li>}
            </ul>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate(`/organizer/events`)}
            className="px-4 py-2 border rounded"
            disabled={publishing}
          >
            Back
          </button>

          <button
            onClick={publish}
            disabled={!canPublish || publishing}
            className={`px-4 py-2 rounded text-white ${
              canPublish
                ? "bg-green-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {publishing ? "Publishing…" : "Publish Event"}
          </button>
        </div>
      </div>
    </div>
  );
}
