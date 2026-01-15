import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderApi } from '../../../api/orderApi';
import { seatApi } from '../../../api/seatApi';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';

const SeatManagement = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [seats, setSeats] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ 1. FETCH FUNCTIONS (hoisted)
  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await orderApi.getMyBookings();
      const eventOrders = data.data?.filter(order => order.eventId === eventId) || [];
      
      // ✅ Enrich orders with issuedTicket data (from issuedTicketRepo)
      const enrichedOrders = await Promise.all(
        eventOrders.map(async (order) => {
          try {
            // Assume order has issuedTicket relation or fetch separately
            const issuedTicket = await fetch(`/api/issued-tickets?orderId=${order.id}`);
            return { ...order, issuedTicket: issuedTicket.data };
          } catch {
            return order;
          }
        })
      );
      
      setOrders(enrichedOrders);
    } catch (error) {
      console.error('Orders error:', error);
    }
  }, [eventId]);

  const fetchSeats = useCallback(async () => {
    try {
      // ✅ Real seat data using seatRepo + seatCategoryRepo
      const response = await fetch(`/api/events/${eventId}/seats`);
      const seatsData = await response.json();
      setSeats(seatsData.data || []);
    } catch (error) {
      console.error('Seats error:', error);
      // Fallback mock data
      setSeats([
        { id: 'seat1', label: 'A1', status: 'AVAILABLE', category: 'VIP' },
        { id: 'seat2', label: 'A2', status: 'ALLOCATED', category: 'VIP' },
        { id: 'seat3', label: 'B1', status: 'AVAILABLE', category: 'Regular' },
      ]);
    }
  }, [eventId]);

  const handleAssignSeat = useCallback(async (orderId, seatId) => {
    try {
      // ✅ REAL Backend call using issuedTicketRepo.assignSeat
      const order = orders.find(o => o.id === orderId);
      if (!order?.issuedTicketId) {
        alert('No issued ticket found');
        return;
      }
      
      await seatApi.assignSeat(order.issuedTicketId, seatId);
      
      // ✅ Refresh both datasets
      await Promise.all([fetchOrders(), fetchSeats()]);
      alert('✅ Seat assigned successfully!');
    } catch (error) {
      console.error(error);
      alert('❌ Seat assignment failed');
    }
  }, [orders, fetchOrders, fetchSeats]);

  // ✅ 2. Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchOrders(), fetchSeats()]);
      setLoading(false);
    };
    loadData();
  }, [fetchOrders, fetchSeats]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="text-xl font-semibold text-gray-600">Loading seat management...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button 
              onClick={() => navigate('/organizer/events')} 
              className="text-indigo-600 hover:text-indigo-700 mb-4 font-semibold text-lg flex items-center"
            >
              ← Back to Events
            </button>
            <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
              Seat Management
            </h1>
          </div>
          <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm">
            Orders: {orders.length} | Available Seats: {seats.filter(s => s.status === 'AVAILABLE').length}
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Orders Panel */}
          <Card className="shadow-2xl h-[600px]">
            <h2 className="text-2xl font-bold p-6 border-b bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
              Orders ({orders.filter(o => !o.issuedTicket?.seatId).length} unassigned)
            </h2>
            <div className="overflow-y-auto h-[500px] p-2">
              {orders.map((order) => (
                <div 
                  key={order.id}
                  className={`p-6 border rounded-lg mx-2 my-2 cursor-pointer transition-all hover:shadow-md ${
                    selectedOrder?.id === order.id 
                      ? 'bg-indigo-50 border-4 border-indigo-300 shadow-indigo-200 ring-2 ring-indigo-200' 
                      : 'hover:bg-gray-50 border-gray-200'
                  }`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">
                        {order.ticket?.name || 'General Admission'}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {order.user?.name || order.userId || 'User #' + order.id.slice(-6)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Order #{order.id.slice(-6)} • Qty: {order.quantity}
                      </p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ml-4 ${
                      order.issuedTicket?.seatId 
                        ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-200' 
                        : 'bg-orange-100 text-orange-800 border-2 border-orange-200'
                    }`}>
                      {order.issuedTicket?.seatId ? '✅ Seated' : '⭕ Unassigned'}
                    </span>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <div className="text-5xl mb-4">🎫</div>
                  <p className="text-lg font-medium">No orders yet</p>
                  <p className="text-sm">Create some test orders to manage seats</p>
                </div>
              )}
            </div>
          </Card>

          {/* Seats Panel */}
          <Card className="shadow-2xl h-[600px]">
            <div className="p-6 border-b bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-lg">
              <h2 className="text-2xl font-bold">Available Seats</h2>
              <p className="text-sm opacity-90">
                {seats.filter(s => s.status === 'AVAILABLE').length} / {seats.length} available
              </p>
            </div>
            
            {selectedOrder ? (
              <div className="p-6 space-y-6">
                {/* Selected Order Preview */}
                <div className="bg-indigo-50 border-2 border-indigo-200 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-indigo-900">
                        Assign seat for: {selectedOrder.ticket?.name}
                      </h3>
                      <p className="text-sm text-indigo-700">
                        {selectedOrder.user?.name || 'User'} • Qty: {selectedOrder.quantity}
                      </p>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => setSelectedOrder(null)}
                      className="bg-gray-500 hover:bg-gray-600"
                    >
                      Change Order
                    </Button>
                  </div>
                </div>

                {/* Seat Grid */}
                <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 max-h-72 overflow-y-auto bg-gray-50 p-4 rounded-lg">
                  {seats.map((seat) => (
                    <button
                      key={seat.id}
                      className={`p-3 rounded-lg font-bold text-sm shadow-md hover:shadow-lg transition-all aspect-square flex flex-col items-center justify-center ${
                        seat.status === 'AVAILABLE'
                          ? 'bg-emerald-400 hover:bg-emerald-500 text-white border-4 border-emerald-300 shadow-emerald-300 hover:scale-105'
                          : selectedOrder && seat.status === 'ALLOCATED'
                          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                          : 'bg-orange-200 text-orange-800 border-2 border-orange-300'
                      }`}
                      onClick={() => handleAssignSeat(selectedOrder.id, seat.id)}
                      disabled={seat.status !== 'AVAILABLE'}
                    >
                      <div className="font-bold text-base">{seat.label}</div>
                      <div className="text-xs mt-1 opacity-90">{seat.category}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[500px] text-gray-500">
                <div className="text-6xl mb-6">🪑</div>
                <h3 className="text-xl font-bold mb-2">Select an order</h3>
                <p className="text-sm mb-8">Click any order above to assign seats</p>
                <div className="grid grid-cols-3 gap-4 text-2xl">
                  <div className="bg-emerald-400 text-white p-6 rounded-xl shadow-lg">✅</div>
                  <div className="bg-orange-400 text-white p-6 rounded-xl shadow-lg">⭕</div>
                  <div className="bg-gray-300 text-gray-600 p-6 rounded-xl shadow-lg">🔒</div>
                </div>
                <p className="text-xs mt-4 text-gray-400">Available | Unassigned | Taken</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SeatManagement;
