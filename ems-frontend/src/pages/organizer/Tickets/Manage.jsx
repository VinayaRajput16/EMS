import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { organizerApi } from "../../../api/organizer.api";

export default function OrganizerTicketManage() {
  const { id: eventId } = useParams();

  const [tickets, setTickets] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    async function loadTickets() {
      const res =
        await organizerApi.getTicketTypesByEvent(eventId);
      setTickets(res.data?.data ?? res.data);
    }
    loadTickets();
  }, [eventId]);

  async function loadTickets() {
    const res =
      await organizerApi.getTicketTypesByEvent(eventId);
    setTickets(res.data?.data ?? res.data);
  }

  async function createTicket(e) {
    e.preventDefault();

    await organizerApi.createTicketType(eventId, {
      name,
      price: Number(price),
      quantity: Number(quantity),
    });

    setName("");
    setPrice("");
    setQuantity("");

    await loadTickets();
  }

  async function removeTicket(id) {
    await organizerApi.deleteTicketType(id);
    await loadTickets();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Ticket Management</h2>

      {tickets.length === 0 ? (
        <p className="text-sm text-gray-600">
          No tickets created yet.
        </p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {tickets.map(t => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>₹{t.price}</td>
                <td>{t.quantity}</td>
                <td>
                  <button
                    className="text-red-600"
                    onClick={() => removeTicket(t.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <form onSubmit={createTicket} className="space-y-2">
        <h4 className="font-medium">Add Ticket Type</h4>

        <input
          className="border p-2 w-full"
          placeholder="Ticket Name (VIP / General)"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <input
          type="number"
          className="border p-2 w-full"
          placeholder="Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
        />

        <input
          type="number"
          className="border p-2 w-full"
          placeholder="Quantity"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          required
        />

        <button className="border px-3 py-1">
          Create Ticket
        </button>
      </form>
    </div>
  );
}
