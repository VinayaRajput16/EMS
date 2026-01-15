// src/pages/user/Bookings.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../../api/orderApi';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await orderApi.getMyBookings();
      setBookings(data.data || []);
    } catch (error) {
      console.error('Bookings error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    if (confirm('Cancel this booking?')) {
      try {
        await orderApi.cancelBooking(orderId);
        fetchBookings();
      } catch {
        alert('Cancel failed');
      }
    }
  };

  if (loading) return <div className="p-8 text-center">Loading bookings...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
            My Bookings ({bookings.length})
          </h1>
        </div>

        {bookings.length === 0 ? (
          <Card className="text-center py-24 shadow-2xl">
            <div className="text-6xl mb-8 text-gray-200">🎫</div>
            <h2 className="text-2xl font-bold mb-4">No bookings yet</h2>
            <p className="text-gray-600 mb-8">Book your first event ticket!</p>
            <Button onClick={() => navigate('/')}>Browse Events</Button>
          </Card>
        ) : (
          <Card className="shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <th className="p-6 text-left font-bold">Event</th>
                    <th className="p-6 text-left font-bold">Ticket</th>
                    <th className="p-6 text-left font-bold">Quantity</th>
                    <th className="p-6 text-left font-bold">Date</th>
                    <th className="p-6 text-left font-bold">Status</th>
                    <th className="p-6 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b hover:bg-gray-50">
                      <td className="p-6 font-semibold max-w-md">
                        {booking.event.title}
                      </td>
                      <td className="p-6">{booking.ticket.name}</td>
                      <td className="p-6 font-bold text-indigo-600">
                        {booking.quantity}
                      </td>
                      <td className="p-6">
                        {new Date(booking.event.startDateTime).toLocaleDateString()}
                      </td>
                      <td>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                          booking.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' 
                          : booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-6 text-right space-x-2">
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => navigate(`/orders/${booking.id}`)}
                        >
                          Details
                        </Button>
                        {booking.status !== 'CANCELLED' && (
                          <Button 
                            size="sm" 
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => handleCancel(booking.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Bookings;
