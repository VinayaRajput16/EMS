import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketApi } from '../../../api/ticketApi';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Card from '../../../components/common/Card';

const TicketSetup = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({ name: '', price: '', totalQuantity: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, [eventId]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data } = await ticketApi.getEventTickets(eventId);
      setTickets(data.data || []);
    } catch (error) {
      console.error('Tickets error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      await ticketApi.createTicket(eventId, newTicket);
      setNewTicket({ name: '', price: '', totalQuantity: '' });
      fetchTickets();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create ticket');
    }
  };

  const handleDelete = async (ticketId) => {
    if (confirm('Delete this ticket?')) {
      try {
        await ticketApi.deleteTicket(ticketId);
        fetchTickets();
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        alert('Delete failed');
      }
    }
  };

  if (loading) return <div className="p-8 text-center">Loading tickets...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <button onClick={() => navigate('/organizer/events')} className="text-indigo-600 hover:text-indigo-700 mb-4 font-semibold">
              ← Back to Events
            </button>
            <h1 className="text-4xl font-black text-gray-900">Setup Tickets</h1>
          </div>
        </div>

        {/* Create Ticket Form */}
        <Card className="p-8 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6">Add New Ticket Type</h2>
          <form onSubmit={handleCreateTicket} className="grid md:grid-cols-3 gap-6 items-end">
            <Input
              label="Ticket Name *"
              placeholder="VIP / Regular / Student"
              value={newTicket.name}
              onChange={(e) => setNewTicket({...newTicket, name: e.target.value})}
              required
            />
            <Input
              label="Price (₹) *"
              type="number"
              min="0"
              step="0.01"
              placeholder="500"
              value={newTicket.price}
              onChange={(e) => setNewTicket({...newTicket, price: e.target.value})}
              required
            />
            <div>
              <Input
                label="Total Quantity *"
                type="number"
                min="1"
                placeholder="100"
                value={newTicket.totalQuantity}
                onChange={(e) => setNewTicket({...newTicket, totalQuantity: e.target.value})}
                required
              />
              <Button type="submit" size="lg" className="w-full mt-4">
                + Add Ticket
              </Button>
            </div>
          </form>
        </Card>

        {/* Tickets List */}
        <Card className="shadow-2xl">
          <h2 className="text-2xl font-bold p-6 border-b">Tickets ({tickets.length})</h2>
          <div className="divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="p-6 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold">{ticket.name}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>₹{ticket.price} | {ticket.availableQuantity}/{ticket.totalQuantity} available</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() => handleDelete(ticket.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TicketSetup;
