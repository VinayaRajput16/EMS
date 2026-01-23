import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { organizerApi } from "../../../api/organizer.api";

export default function OrganizerEventView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  let isMounted = true;

  async function loadEvent() {
    const res = await organizerApi.getEventById(id);
    if (isMounted) {
      setEvent(res.data.data);
      setLoading(false);
    }
  }

  loadEvent();

  return () => {
    isMounted = false;
  };
}, [id]);


 async function publishEvent() {
  await organizerApi.publishEvent(id);
  // refetch after publish
  const res = await organizerApi.getEventById(id);
  setEvent(res.data.data);
}

  if (loading) return <div>Loading...</div>;
  if (!event) return <div>Event not found</div>;

  const canPublish =
    event.status === "DRAFT" && event.venueLayoutTemplateId;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{event.title}</h2>

      <div className="space-y-1 text-sm">
        <p><strong>Status:</strong> {event.status}</p>
        <p><strong>Allocation Mode:</strong> {event.allocationMode}</p>
        <p>
          <strong>Start:</strong>{" "}
          {new Date(event.startDateTime).toLocaleString()}
        </p>
        <p>
          <strong>End:</strong>{" "}
          {new Date(event.endDateTime).toLocaleString()}
        </p>
      </div>

      <div className="border p-3 rounded space-y-2">
        <p className="font-medium">Venue</p>

        {event.venueLayoutTemplateId ? (
          <p className="text-green-600">Venue assigned</p>
        ) : (
          <p className="text-red-600">No venue assigned</p>
        )}

        {event.status === "DRAFT" && !event.venueLayoutTemplateId && (
          <button
            className="border px-3 py-1"
            onClick={() => navigate(`/organizer/events/${id}/assign-venue`)}
          >
            Assign Venue
          </button>
        )}
      </div>

      {canPublish && (
        <button
          className="border px-4 py-2 bg-black text-white"
          onClick={publishEvent}
        >
          Publish Event
        </button>
      )}

      {event.status === "PUBLISHED" && (
        <p className="text-green-700 font-medium">
          Event is published
        </p>
      )}
    </div>
  );
}
