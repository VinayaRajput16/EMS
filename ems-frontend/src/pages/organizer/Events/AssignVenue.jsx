import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { organizerApi } from "../../../api/organizer.api";

export default function OrganizerAssignVenue() {
  const { id } = useParams(); // eventId
  const navigate = useNavigate();

  const [venues, setVenues] = useState([]);
  const [venueId, setVenueId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadVenues() {
      const res = await organizerApi.getVenues();
      if (mounted) {
        setVenues(res.data?.data ?? res.data);
        setLoading(false);
      }
    }

    loadVenues();

    return () => {
      mounted = false;
    };
  }, []);

  async function submit(e) {
    e.preventDefault();

    if (!venueId) {
      alert("Please select a venue");
      return;
    }

    await organizerApi.assignVenueToEvent(id, venueId);
    navigate(`/organizer/events/${id}`);
  }

  if (loading) return <div>Loading venues...</div>;

  return (
    <form onSubmit={submit} className="space-y-4">
      <h2 className="text-lg font-medium">Assign Venue</h2>

      <select
        className="border p-2 w-full"
        value={venueId}
        onChange={(e) => setVenueId(e.target.value)}
        required
      >
        <option value="">Select Venue</option>
        {venues.map((v) => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>

      <button className="border px-4 py-2">
        Assign Venue
      </button>
    </form>
  );
}
