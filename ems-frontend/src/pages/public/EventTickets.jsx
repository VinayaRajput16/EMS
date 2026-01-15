import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketApi } from '../../api/ticketApi';
import { orderApi } from '../../api/orderApi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const EventTickets = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, [eventId]);

  const fetchTickets = async () => {
    try {
      const { data } = await ticketApi.getEventTickets(eventId);
      setTickets(data.data || []);
    } catch (error) {
      console.error('Tickets error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (ticketId, value) => {
    setQuantities(prev => ({
      ...prev,
      [ticketId]: parseInt(value) || 0
    }));
  };

  const handleBuyTickets = async (ticketId) => {
    const quantity = quantities[ticketId];
    if (quantity < 1) {
      alert('Please select quantity');
      return;
    }

    try {
      await orderApi.bookTickets({
        eventId,
        ticketId,
        quantity
      });
      alert('Tickets booked successfully!');
      navigate('/user/bookings');
    } catch (error) {
      alert(error.response?.data?.message || 'Booking failed');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading tickets...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tickets.map((ticket) => (
            <Card key={ticket.id} className="p-8 text-center shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{ticket.name}</h3>
              <p className="text-4xl font-black text-indigo-600 mb-6">₹{ticket.price}</p>
              <div className="space-y-4">
                <Input
                  type="number"
                  min="1"
                  max={ticket.availableQuantity}
                  placeholder="Qty"
                  value={quantities[ticket.id] || ''}
                  onChange={(e) => handleQuantityChange(ticket.id, e.target.value)}
                  className="w-24 mx-auto text-center text-lg"
                />
                <Button 
                  className="w-full shadow-xl"
                  onClick={() => handleBuyTickets(ticket.id)}
                  disabled={!quantities[ticket.id] || quantities[ticket.id] > ticket.availableQuantity}
                >
                  Buy Now ({ticket.availableQuantity} left)
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventTickets;
