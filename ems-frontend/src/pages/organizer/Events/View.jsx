// src/pages/organizer/Events/View.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { organizerApi } from "../../../api/organizer.api";

export default function OrganizerEventView() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    organizerApi
      .getEventById(eventId)
      .then((res) => {
        setEvent(res.data.data);
      })
      .catch(() => {
        setError("Failed to load event");
      })
      .finally(() => setLoading(false));
  }, [eventId]);

  async function publishEvent() {
    setPublishing(true);
    setError("");

    try {
      await organizerApi.publishEvent(eventId);
      const res = await organizerApi.getEventById(eventId);
      setEvent(res.data.data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Event cannot be published yet"
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

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Event not found
      </div>
    );
  }

  const isPublished = event.status === "PUBLISHED";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow space-y-8">
        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">
              {event.title}
            </h1>
            <p className="text-gray-600 mt-1">
              Status:{" "}
              <span
                className={`font-semibold ${
                  isPublished
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {event.status}
              </span>
            </p>
          </div>

          {!isPublished && (
            <button
              onClick={() =>
                navigate(`/organizer/events/${eventId}/edit`)
              }
              className="px-4 py-2 border rounded"
            >
              Edit Event
            </button>
          )}
        </div>

        {/* DETAILS */}
        <div className="space-y-2">
          <p>
            <strong>Description:</strong>{" "}
            {event.description || "—"}
          </p>
          <p>
            <strong>Start:</strong>{" "}
            {new Date(event.startDateTime).toLocaleString()}
          </p>
          <p>
            <strong>End:</strong>{" "}
            {new Date(event.endDateTime).toLocaleString()}
          </p>
          <p>
            <strong>Seating Allocation:</strong>{" "}
            {event.allocationMode}
          </p>
        </div>

        {/* SETUP STEPS */}
        {!isPublished && (
          <div className="border-t pt-6 space-y-4">
            <h2 className="text-xl font-semibold">
              Event Setup
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() =>
                  navigate(
                    `/organizer/events/${eventId}/venue/create`
                  )
                }
                className="px-4 py-3 border rounded text-left hover:bg-gray-50"
              >
                <strong>1. Venue</strong>
                <p className="text-sm text-gray-600">
                  Layout & capacity
                </p>
              </button>

              <button
                onClick={() =>
                  navigate(
                    `/organizer/events/${eventId}/seat-categories`
                  )
                }
                className="px-4 py-3 border rounded text-left hover:bg-gray-50"
              >
                <strong>2. Seat Categories</strong>
                <p className="text-sm text-gray-600">
                  VIP, Regular, etc.
                </p>
              </button>

              <button
                onClick={() =>
                  navigate(
                    `/organizer/events/${eventId}/tickets`
                  )
                }
                className="px-4 py-3 border rounded text-left hover:bg-gray-50"
              >
                <strong>3. Tickets</strong>
                <p className="text-sm text-gray-600">
                  Pricing & mapping
                </p>
              </button>
            </div>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded">
            {error}
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 border-t pt-6">
          {!isPublished && (
            <button
              onClick={publishEvent}
              disabled={publishing}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              {publishing
                ? "Publishing…"
                : "Publish Event"}
            </button>
          )}

          <button
            onClick={() =>
              navigate("/organizer/events")
            }
            className="px-4 py-2 border rounded"
          >
            Back to Events
          </button>
        </div>
      </div>
    </div>
  );
}
