// src/pages/user/Events/EventDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userApi } from "../../../api/user.api";
import LoadingSpinner from "../../../components/LoadingSpinner";
import SeatMap from "../../../components/SeatMap";

export default function EventDetails() {
  const { userId, eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    userApi.getEventDetails(eventId)
      .then(res => { setEvent(res.data.data); setLoading(false); })
      .catch(err => { setError(err.response?.data?.message || "Failed to load event details"); setLoading(false); });
  }, [eventId]);

  const handleQuantityChange = (ticketTypeId, quantity) => {
    setSelectedTickets(prev => ({ ...prev, [ticketTypeId]: Math.max(0, parseInt(quantity) || 0) }));
  };

  const getTotalTickets = () => Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);

  const getTotalPrice = () => {
    if (!event) return 0;
    return event.ticketTypes.reduce((total, tt) => total + ((selectedTickets[tt.id] || 0) * parseFloat(tt.price)), 0);
  };

  const handleBooking = async () => {
    const ticketEntries = Object.entries(selectedTickets).filter(([_, qty]) => qty > 0);
    if (ticketEntries.length === 0) { setError("Please select at least one ticket"); return; }
    const [ticketTypeId, quantity] = ticketEntries[0];
    if (event.allocationMode === "MANUAL" && selectedSeats.length !== quantity) {
      setError(`Please select exactly ${quantity} seat(s)`); return;
    }
    setBookingLoading(true); setError("");
    try {
      const bookingData = { eventId: event.id, ticketTypeId, quantity };
      if (event.allocationMode === "MANUAL") bookingData.seatIds = selectedSeats.map(s => s.id);
      await userApi.createBooking(bookingData);
      navigate(`/user/${userId}/bookings`);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Please try again.");
      setBookingLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center p-4">
      <LoadingSpinner className="w-8 h-8 text-emerald-400" />
    </div>
  );

  if (!event) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center p-4">
      <div className="bg-white/5 rounded-xl p-6 border border-white/10 max-w-sm mx-auto text-center shadow-xl">
        <h2 className="text-lg font-bold text-slate-200 mb-3">Event Not Found</h2>
        <button onClick={() => navigate(`/user/${userId}/events`)} className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl text-sm shadow hover:-translate-y-0.5 transition-all">
          ← Back to Events
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white p-4 md:p-5">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/user/${userId}/events`)}
          className="group mb-4 inline-flex items-center px-3 py-1.5 bg-slate-800/70 border border-slate-700/70 rounded-xl text-slate-300 text-sm font-medium hover:bg-slate-700/90 hover:border-emerald-500/60 hover:text-emerald-300 transition-all duration-300 shadow"
        >
          <svg className="w-3.5 h-3.5 mr-1.5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Events
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Left: Event details + tickets */}
          <div className="lg:col-span-2 space-y-4">

            {/* Event Header */}
            <div className="bg-white/8 backdrop-blur-2xl rounded-2xl shadow-md p-5 border border-white/15">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent mb-3">
                {event.title}
              </h1>
              {event.description && (
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/50 rounded-xl p-3 border border-slate-800/60">
                  {event.description}
                </p>
              )}
            </div>

            {/* Event Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "Start", value: formatDate(event.startDateTime), color: "emerald" },
                { label: "End", value: formatDate(event.endDateTime), color: "rose" },
                event.venue && { label: "Venue", value: event.venue.name, sub: event.venue.capacity ? `Cap: ${event.venue.capacity}` : null, color: "blue" },
                event.organizer && { label: "Organizer", value: event.organizer.name, color: "purple" },
              ].filter(Boolean).map((item) => (
                <div key={item.label} className={`bg-white/6 backdrop-blur-xl rounded-xl p-3 border border-white/15 hover:border-${item.color}-500/40 hover:bg-white/10 transition-all duration-300`}>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">{item.label}</p>
                  <p className="text-sm font-bold text-slate-100 truncate">{item.value}</p>
                  {item.sub && <p className="text-xs text-emerald-400 font-semibold">{item.sub}</p>}
                </div>
              ))}
            </div>

            {/* Tickets */}
            <div className="bg-white/8 backdrop-blur-2xl rounded-2xl shadow-md p-5 border border-white/20">
              <h2 className="text-lg font-bold bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent mb-4 text-center">
                🎫 Choose Tickets
              </h2>
              {event.ticketTypes?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                  {event.ticketTypes.map((ticketType) => {
                    const categoryName = ticketType.mappings?.length > 0
                      ? ticketType.mappings[0].seatCategory?.name
                      : ticketType.name;
                    return (
                      <div key={ticketType.id} className="bg-white/12 border border-white/30 rounded-xl p-3 flex flex-col hover:bg-white/18 hover:border-emerald-500/60 transition-all duration-300">
                        <h3 className="text-sm font-bold text-slate-100 mb-3 line-clamp-2 min-h-[2.5rem]">
                          {categoryName || "General Admission"}
                        </h3>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="text-xl font-black bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                            ${parseFloat(ticketType.price).toFixed(2)}
                          </div>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={selectedTickets[ticketType.id] || 0}
                            onChange={(e) => handleQuantityChange(ticketType.id, e.target.value)}
                            className="w-14 h-8 text-sm font-bold text-center bg-white/20 border border-slate-400/50 rounded-lg text-slate-100 outline-none focus:border-emerald-400"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-sm font-bold text-slate-300 mb-1">No Tickets Available</h3>
                  <p className="text-xs text-slate-500">Tickets are sold out or not yet available.</p>
                </div>
              )}
            </div>

            {/* Seat Selection */}
            {event.allocationMode === "MANUAL" && getTotalTickets() > 0 && (
              <div className="bg-white/8 backdrop-blur-2xl rounded-2xl shadow-md p-5 border border-white/20">
                <div className="text-center mb-3">
                  <h2 className="text-lg font-bold bg-gradient-to-r from-slate-100 via-purple-400 to-purple-500 bg-clip-text text-transparent mb-1">
                    🎭 Pick Your Seats
                  </h2>
                  <p className="text-xs text-slate-400">Select <span className="text-emerald-400 font-bold">{getTotalTickets()}</span> seat{getTotalTickets() !== 1 ? 's' : ''}</p>
                </div>
                <div className="max-h-64 overflow-auto rounded-xl border border-slate-700/50 bg-slate-900/20 p-3">
                  <SeatMap eventId={event.id} quantity={getTotalTickets()} onSeatsSelected={setSelectedSeats} />
                </div>
              </div>
            )}

            {event.allocationMode === "AUTOMATED" && getTotalTickets() > 0 && (
              <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-xl p-4 flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-emerald-100">✨ Smart Seating</h3>
                  <p className="text-xs text-emerald-200">Best available seats assigned automatically</p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/12 backdrop-blur-2xl rounded-2xl shadow-md p-5 border border-white/25 lg:sticky lg:top-4">
              <h2 className="text-lg font-bold bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent mb-4 text-center">
                💳 Summary
              </h2>

              <div className="space-y-3 mb-4">
                <div className="bg-slate-800/70 rounded-xl p-3 border border-slate-700/70 text-center">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1">Tickets</p>
                  <p className="text-2xl font-black text-slate-100">{getTotalTickets()}</p>
                </div>
                <div className="bg-emerald-500/20 rounded-xl p-4 border border-emerald-500/50 text-center">
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-300 mb-1">Total</p>
                  <p className="text-3xl font-black text-emerald-100">${getTotalPrice().toFixed(2)}</p>
                </div>
              </div>

              {error && (
                <div className="mb-3 p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl">
                  <p className="text-xs text-rose-200 font-medium">{error}</p>
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={
                  getTotalTickets() === 0 || bookingLoading ||
                  (event.allocationMode === "MANUAL" && selectedSeats.length !== getTotalTickets())
                }
                className={`w-full h-11 rounded-xl font-bold text-sm shadow transition-all duration-300 flex items-center justify-center ${
                  getTotalTickets() === 0 || bookingLoading ||
                  (event.allocationMode === "MANUAL" && selectedSeats.length !== getTotalTickets())
                    ? 'bg-slate-800/70 border border-slate-700/70 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white hover:shadow-emerald-500/30 hover:scale-[1.01] active:scale-95'
                }`}
              >
                {bookingLoading ? (
                  <><svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>Processing...</>
                ) : event.allocationMode === "MANUAL" && selectedSeats.length !== getTotalTickets() ? (
                  `Pick ${getTotalTickets()} Seat${getTotalTickets() !== 1 ? 's' : ''}`
                ) : (
                  'Confirm Booking'
                )}
              </button>

              <p className="text-slate-500 text-xs text-center mt-3">Booking confirmed instantly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}