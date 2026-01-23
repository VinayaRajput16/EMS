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
  const [venueLayoutTemplateId, setVenueLayoutTemplateId] = useState(null); // ✅ Changed from venueId
  const [ticketTypes, setTicketTypes] = useState([]);

  // seat categories (read-only here)
  const [seatCategories, setSeatCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const eventRes = await organizerApi.getEventById(eventId);
        const eventData = eventRes.data.data;
        
        // ✅ Add console log to debug
        console.log('Event Data:', eventData);

        const ticketsRes = await organizerApi.getTicketTypesByEvent(eventId);
        const ticketsData = ticketsRes.data?.data ?? ticketsRes.data;
        
        // ✅ Add console log to debug tickets
        console.log('Tickets Data:', ticketsData);

        if (!mounted) return;

        setTitle(eventData.title);
        setDescription(eventData.description ?? "");
        setStartDateTime(eventData.startDateTime.slice(0, 16));
        setEndDateTime(eventData.endDateTime.slice(0, 16));
        setStatus(eventData.status);
        
        // ✅ Use the correct field from backend
        setVenueLayoutTemplateId(eventData.venueLayoutTemplateId ?? null);
        
        // ✅ Set tickets properly
        setTicketTypes(ticketsData);

        // ✅ For seat categories, you need to find the actual venueId
        // Since backend only stores venueLayoutTemplateId, we need to get venues
        // and find which venue has this layout template
        if (eventData.venueLayoutTemplateId) {
          try {
            const venuesRes = await organizerApi.getVenues();
            const allVenues = venuesRes.data?.data ?? venuesRes.data;
            
            // Find the venue that matches the layout template
            const matchedVenue = allVenues.find(
              v => v.layoutTemplateId === eventData.venueLayoutTemplateId
            );
            
            if (matchedVenue) {
              const seatsRes = await organizerApi.getSeatCategoriesByVenue(matchedVenue.id);
              setSeatCategories(seatsRes.data?.data ?? seatsRes.data);
            }
          } catch (error) {
            console.error('Error fetching seat categories:', error);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading event:', error);
        setLoading(false);
      }
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

        {/* ✅ Updated condition */}
        {!venueLayoutTemplateId && (
          <p className="text-sm text-red-600">
            Assign a venue before configuring seats.
          </p>
        )}

        {venueLayoutTemplateId && seatCategories.length === 0 && (
          <p className="text-sm text-gray-600">
            No seat categories configured yet.
          </p>
        )}

        {venueLayoutTemplateId && seatCategories.length > 0 && (
          <table className="w-full border text-sm">
            <thead>
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Capacity</th>
                <th className="border p-2">Priority</th>
              </tr>
            </thead>
            <tbody>
              {seatCategories.map((c) => (
                <tr key={c.id}>
                  <td className="border p-2">{c.name}</td>
                  <td className="border p-2">{c.capacity}</td>
                  <td className="border p-2">{c.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ✅ Note: You'll need to store the actual venue ID somewhere to navigate properly */}
        {/* For now, this button won't work correctly - see note below */}
        {venueLayoutTemplateId && (
          <p className="text-sm text-gray-500 italic">
            Seat categories are configured at the venue level.
          </p>
        )}
      </div>

      {/* TICKET CONFIGURATION */}
      <div className="border-t pt-4 space-y-3">
        <h3 className="font-medium">Ticket Configuration</h3>

        {/* ✅ Better null check */}
        {(!ticketTypes || ticketTypes.length === 0) && (
          <p className="text-sm text-gray-600">
            No ticket types created yet.
          </p>
        )}

        {ticketTypes && ticketTypes.length > 0 && (
          <table className="w-full border text-sm">
            <thead>
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Total Quantity</th>
                <th className="border p-2">Available</th>
              </tr>
            </thead>
            <tbody>
              {ticketTypes.map(t => (
                <tr key={t.id}>
                  <td className="border p-2">{t.name}</td>
                  <td className="border p-2">₹{t.price}</td>
                  {/* ✅ Use correct field names from backend */}
                  <td className="border p-2">{t.totalQuantity}</td>
                  <td className="border p-2">{t.availableQuantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
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