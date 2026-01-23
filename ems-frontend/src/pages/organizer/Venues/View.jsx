// src/pages/organizer/Venues/View.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { organizerApi } from "../../../api/organizer.api";

export default function OrganizerVenueView() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);

  useEffect(() => {
    organizerApi.getVenueById(id).then(res => {
      setVenue(res.data.data);
    });
  }, [id]);

  if (!venue) return null;

  return (
    <div className="space-y-2">
      <h2 className="text-lg">{venue.name}</h2>
      <p>Location: {venue.location}</p>
      <p>Capacity: {venue.capacity}</p>
    </div>
  );
}

