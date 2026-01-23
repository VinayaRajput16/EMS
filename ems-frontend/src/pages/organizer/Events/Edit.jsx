import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { organizerApi } from "../../../api/organizer.api";

export default function OrganizerEventEdit() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();

  // event fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [status, setStatus] = useState("");
  const [venueId, setVenueId] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);


  // seat categories (read-only here)
  const [seatCategories, setSeatCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const eventRes = await organizerApi.getEventById(eventId);
      const eventData = eventRes.data.data;
      const ticketsRes =
  await organizerApi.getTicketTypesByEvent(eventId);
setTicketTypes(ticketsRes.data?.data ?? ticketsRes.data);


      if (!mounted) return;

      setTitle(eventData.title);
      setDescription(eventData.description ?? "");
      setStartDateTime(eventData.startDateTime.slice(0, 16));
      setEndDateTime(eventData.endDateTime.slice(0, 16));
      setStatus(eventData.status);
      setVenueId(eventData.venueId ?? null);

      // fetch seat categories ONLY if venue assigned
      if (eventData.venueId) {
        const seatsRes =
          await organizerApi.getSeatCategoriesByVenue(eventData.venueId);
        setSeatCategories(seatsRes.data?.data ?? seatsRes.data);
      }

      setLoading(false);
    }

    load();

    return () => {
      mounted = false;
    };
  }, [eventId]);

  async function updateEvent(e) {
    e.preventDefault();

    await organizerApi.updateEvent(eventId, {
      title,
      description,
      startDateTime,
      endDateTime,
    });

    alert("Event updated");
    navigate(`/organizer/events/${eventId}`);
  }

  if (loading) return <div>Loading...</div>;

  if (status !== "DRAFT") {
    return (
      <div className="text-red-600">
        Only DRAFT events can be edited.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* EVENT DETAILS */}
      <form onSubmit={updateEvent} className="space-y-3">
        <h2 className="text-lg font-medium">Edit Event</h2>

        <input
          className="border p-2 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="border p-2 w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="datetime-local"
          className="border p-2 w-full"
          value={startDateTime}
          onChange={(e) => setStartDateTime(e.target.value)}
          required
        />

        <input
          type="datetime-local"
          className="border p-2 w-full"
          value={endDateTime}
          onChange={(e) => setEndDateTime(e.target.value)}
          required
        />

        <button className="border px-4 py-2">
          Save Event Details
        </button>
      </form>

      {/* SEAT CONFIGURATION (READ ONLY) */}
      <div className="border-t pt-4 space-y-3">
        <h3 className="font-medium">Seat Configuration</h3>

        {!venueId && (
          <p className="text-sm text-red-600">
            Assign a venue before configuring seats.
          </p>
        )}

        {venueId && seatCategories.length === 0 && (
          <p className="text-sm text-gray-600">
            No seat categories configured yet.
          </p>
        )}

        {venueId && seatCategories.length > 0 && (
          <table className="w-full border text-sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Capacity</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {seatCategories.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.capacity}</td>
                  <td>{c.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {venueId && (
          <button
            className="border px-3 py-1"
            onClick={() =>
              navigate(
                `/organizer/venues/${venueId}/seat-categories`
              )
            }
          >
            Configure Seat Categories
          </button>
        )}
      </div>
      {/* TICKET CONFIGURATION */}
<div className="border-t pt-4 space-y-3">
  <h3 className="font-medium">Ticket Configuration</h3>

  {ticketTypes?.length === 0 && (
    <p className="text-sm text-gray-600">
      No ticket types created yet.
    </p>
  )}

  {ticketTypes?.length > 0 && (
    <ul className="text-sm list-disc pl-5">
      {ticketTypes.map(t => (
        <li key={t.id}>
          {t.name} – ₹{t.price} – {t.quantity}
        </li>
      ))}
    </ul>
  )}

  <button
    className="border px-3 py-1"
    onClick={() =>
      navigate(`/organizer/events/${eventId}/tickets`)
    }
  >
    Manage Tickets
  </button>
</div>

    </div>
  );
}
