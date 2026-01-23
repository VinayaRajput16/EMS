import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { organizerApi } from "../../../api/organizer.api";

export default function SeatCategoryCreate() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [priority, setPriority] = useState("");

  async function submit(e) {
    e.preventDefault();

    await organizerApi.createSeatCategory({
      eventId,
      name,
      capacity: Number(capacity),
      priority: Number(priority),
    });

    navigate(`/organizer/events/${eventId}/seat-categories`);
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <h2 className="text-lg font-medium">Create Seat Category</h2>

      <input
        className="border p-2 w-full"
        placeholder="Category Name (e.g. VIP)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="number"
        className="border p-2 w-full"
        placeholder="Capacity"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
        required
      />

      <input
        type="number"
        className="border p-2 w-full"
        placeholder="Priority (lower = higher priority)"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        required
      />

      <button className="border px-4 py-2">
        Create Category
      </button>
    </form>
  );
}
