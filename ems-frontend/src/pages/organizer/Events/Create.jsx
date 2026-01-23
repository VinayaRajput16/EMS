import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { organizerApi } from "../../../api/organizer.api";

export default function OrganizerEventCreate() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [allocationMode, setAllocationMode] = useState("MANUAL");
  const [venues, setVenues] = useState([]);
  const [venueId, setVenueId] = useState("");

  useEffect(() => {
    organizerApi.getVenues().then((res) => {
      setVenues(res.data?.data ?? res.data);
    });
  }, []);

  async function submit(e) {
    e.preventDefault();

    if (allocationMode === "AUTOMATED" && !venueId) {
      alert("Automated seating requires a venue");
      return;
    }

    const res = await organizerApi.createEvent({
      title,
      description,
      startDateTime,
      endDateTime,
      allocationMode,
    });

    if (venueId) {
      await organizerApi.assignVenueToEvent(res.data.data.id, venueId);
    }

    navigate("/organizer/events");
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <h2 className="text-lg">Create Event</h2>

      <input
        className="border p-2 w-full"
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        className="border p-2 w-full"
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="datetime-local"
        className="border p-2 w-full"
        onChange={(e) => setStartDateTime(e.target.value)}
        required
      />

      <input
        type="datetime-local"
        className="border p-2 w-full"
        onChange={(e) => setEndDateTime(e.target.value)}
        required
      />

      <select
        className="border p-2 w-full"
        onChange={(e) => setAllocationMode(e.target.value)}
      >
        <option value="MANUAL">Manual Seating</option>
        <option value="AUTOMATED">Automated Seating</option>
      </select>

      <select
        className="border p-2 w-full"
        onChange={(e) => setVenueId(e.target.value)}
      >
        <option value="">Assign Venue (optional)</option>
        {venues.map((v) => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>

      <button className="border px-4 py-2">Create Event</button>
    </form>
  );
}
