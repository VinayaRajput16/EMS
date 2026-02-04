// src/pages/organizer/Venues/View.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { organizerApi } from "../../../api/organizer.api";

export default function OrganizerVenueView() {
  const { id: eventId } = useParams(); // Extract id and rename to eventId
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use getVenueByEvent with eventId
    organizerApi.getVenueByEvent(eventId)
      .then(res => {
        setVenue(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load venue:", err);
        setLoading(false);
      });
  }, [eventId]);

  if (loading) {
    return <div className="p-8">Loading venue...</div>;
  }

  if (!venue) {
    return <div className="p-8">Venue not found</div>;
  }

  return (
    <div className="space-y-4 p-8">
      <h2 className="text-2xl font-bold">{venue.name}</h2>
      <div className="space-y-2">
        <p><strong>Location:</strong> {venue.location}</p>
        <p><strong>Capacity:</strong> {venue.capacity}</p>
        <p><strong>Layout Type:</strong> {venue.layoutType}</p>
      </div>
    </div>
  );
}