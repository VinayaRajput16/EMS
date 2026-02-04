// src/pages/user/Events/EventDetails.jsx - FIXED RESPONSIVE DESIGN
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
      .then(res => {
        setEvent(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.message || "Failed to load event details");
        setLoading(false);
      });
  }, [eventId]);

  const handleQuantityChange = (ticketTypeId, quantity) => {
    setSelectedTickets(prev => ({
      ...prev,
      [ticketTypeId]: Math.max(0, parseInt(quantity) || 0)
    }));
  };

  const getTotalTickets = () => {
    return Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalPrice = () => {
    if (!event) return 0;
    return event.ticketTypes.reduce((total, tt) => {
      const qty = selectedTickets[tt.id] || 0;
      return total + (qty * parseFloat(tt.price));
    }, 0);
  };

  const handleBooking = async () => {
    const ticketEntries = Object.entries(selectedTickets).filter(([_, qty]) => qty > 0);
    
    if (ticketEntries.length === 0) {
      setError("Please select at least one ticket");
      return;
    }

    const [ticketTypeId, quantity] = ticketEntries[0];

    if (event.allocationMode === "MANUAL") {
      if (selectedSeats.length !== quantity) {
        setError(`Please select exactly ${quantity} seat(s)`);
        return;
      }
    }

    setBookingLoading(true);
    setError("");

    try {
      const bookingData = {
        eventId: event.id,
        ticketTypeId: ticketTypeId,
        quantity: quantity,
      };

      if (event.allocationMode === "MANUAL") {
        bookingData.seatIds = selectedSeats.map(seat => seat.id);
      }

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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-8 border border-white/10 shadow-2xl max-w-sm w-full">
          <LoadingSpinner className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <p className="text-slate-400 font-medium text-center">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-white/5 backdrop-blur-2xl rounded-2xl p-8 border border-white/10 max-w-md mx-auto text-center shadow-2xl">
          <div className="w-16 h-16 bg-slate-800/50 rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-700/50">
            <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10a3 3 0 016 0m-6 0a9 9 0 0118 0 9 9 0 01-18 0" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-200 mb-4">Event Not Found</h2>
          <button
            onClick={() => navigate(`/user/${userId}/events`)}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all duration-300"
          >
            ← Back to Events
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white p-4 md:p-6 lg:p-8">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-40 w-64 h-64 lg:w-96 lg:h-96 bg-gradient-to-r from-emerald-500/5 to-emerald-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-40 w-64 h-64 lg:w-96 lg:h-96 bg-gradient-to-l from-purple-500/5 to-purple-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/user/${userId}/events`)}
          className="group mb-6 inline-flex items-center px-4 py-2 bg-slate-800/70 backdrop-blur-xl border border-slate-700/70 rounded-xl text-slate-300 font-medium hover:bg-slate-700/90 hover:border-emerald-500/70 hover:text-emerald-300 transition-all duration-300 shadow-lg"
        >
          <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Events
        </button>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT: Event Details + Tickets (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Event Header - Compact */}
            <div className="bg-white/8 backdrop-blur-2xl rounded-2xl shadow-xl p-6 border border-white/15">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent mb-4">
                {event.title}
              </h1>
              
              {event.description && (
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl p-4 border border-slate-800/60">
                  <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              )}
            </div>

            {/* Event Info Grid - Compact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Time */}
              <div className="group bg-white/6 backdrop-blur-xl rounded-xl p-4 border border-white/15 flex items-center hover:bg-white/12 hover:border-emerald-500/50 transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg mr-3 flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Start</p>
                  <p className="text-sm md:text-base font-bold text-slate-100 truncate">{formatDate(event.startDateTime)}</p>
                </div>
              </div>

              {/* End Time */}
              <div className="group bg-white/6 backdrop-blur-xl rounded-xl p-4 border border-white/15 flex items-center hover:bg-white/12 hover:border-rose-500/50 transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg flex items-center justify-center shadow-lg mr-3 flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">End</p>
                  <p className="text-sm md:text-base font-bold text-slate-100 truncate">{formatDate(event.endDateTime)}</p>
                </div>
              </div>

              {/* Venue */}
              {event.venue && (
                <div className="group bg-white/6 backdrop-blur-xl rounded-xl p-4 border border-white/15 flex items-center hover:bg-white/12 hover:border-blue-500/50 transition-all duration-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg mr-3 flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Venue</p>
                    <p className="text-sm md:text-base font-bold text-slate-100 truncate">{event.venue.name}</p>
                    {event.venue.capacity && (
                      <p className="text-xs text-emerald-400 font-semibold">Cap: {event.venue.capacity}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Organizer */}
              {event.organizer && (
                <div className="group bg-white/6 backdrop-blur-xl rounded-xl p-4 border border-white/15 flex items-center hover:bg-white/12 hover:border-purple-500/50 transition-all duration-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg mr-3 flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Organizer</p>
                    <p className="text-sm md:text-base font-bold text-slate-100 truncate">{event.organizer.name}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Tickets - Compact & Scrollable */}
            <div className="bg-white/8 backdrop-blur-2xl rounded-2xl shadow-xl p-6 border border-white/20">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent mb-6 text-center">
                🎫 Choose Tickets
              </h2>
              
              {event.ticketTypes && event.ticketTypes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-900/30 pr-2">
                  {event.ticketTypes.map((ticketType) => {
                    const categoryName = ticketType.mappings && ticketType.mappings.length > 0
                      ? ticketType.mappings[0].seatCategory?.name
                      : ticketType.name;
                    
                    return (
                      <div
                        key={ticketType.id}
                        className="group bg-white/12 backdrop-blur-xl border border-white/40 rounded-xl p-4 flex flex-col hover:bg-white/20 hover:border-emerald-500/70 hover:shadow-xl transition-all duration-300"
                      >
                        <h3 className="text-base md:text-lg font-bold text-slate-100 mb-3 line-clamp-2 min-h-[3rem]">
                          {categoryName || "General Admission"}
                        </h3>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                            ${parseFloat(ticketType.price).toFixed(2)}
                          </div>
                          
                          <div className="w-16 h-10 bg-white/40 backdrop-blur-xl border-2 border-slate-400/60 rounded-lg flex items-center justify-center group-hover:border-emerald-400/80 transition-all">
                            <input
                              type="number"
                              min="0"
                              max="10"
                              value={selectedTickets[ticketType.id] || 0}
                              onChange={(e) => handleQuantityChange(ticketType.id, e.target.value)}
                              className="w-full h-full text-base font-bold text-center bg-transparent border-0 outline-none text-slate-100"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-slate-800/60 rounded-xl flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-600/60">
                    <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-300 mb-2">No Tickets Available</h3>
                  <p className="text-sm text-slate-500">Tickets for this event are sold out or not yet available.</p>
                </div>
              )}
            </div>

            {/* Seat Selection - Compact */}
            {event.allocationMode === "MANUAL" && getTotalTickets() > 0 && (
              <div className="bg-white/8 backdrop-blur-2xl rounded-2xl shadow-xl p-6 border border-white/20">
                <div className="text-center mb-4">
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-100 via-purple-400 to-purple-500 bg-clip-text text-transparent mb-2">
                    🎭 Pick Your Seats
                  </h2>
                  <p className="text-sm text-slate-400">Select exactly <span className="text-emerald-400 font-bold">{getTotalTickets()}</span> seat{getTotalTickets() !== 1 ? 's' : ''}</p>
                </div>
                <div className="max-h-80 overflow-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-900/30 rounded-xl border border-slate-700/50 bg-slate-900/20 p-4">
                  <SeatMap
                    eventId={event.id}
                    quantity={getTotalTickets()}
                    onSeatsSelected={setSelectedSeats}
                  />
                </div>
              </div>
            )}

            {/* Auto Allocation Info */}
            {event.allocationMode === "AUTOMATED" && getTotalTickets() > 0 && (
              <div className="bg-gradient-to-r from-emerald-500/12 to-emerald-600/12 backdrop-blur-xl border border-emerald-500/50 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-100 mb-1">✨ Smart Seating</h3>
                    <p className="text-sm text-emerald-200">Best available seats assigned automatically</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Booking Summary - Compact & Sticky */}
          <div className="lg:col-span-1">
            <div className="bg-white/12 backdrop-blur-2xl rounded-2xl shadow-xl p-6 border border-white/25 sticky top-4 lg:top-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                  💳 Summary
                </h2>
              </div>

              {/* Summary Stats */}
              <div className="space-y-4 mb-6">
                <div className="bg-slate-800/70 backdrop-blur-xl rounded-xl p-4 border border-slate-700/70 text-center">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">Tickets</p>
                  <p className="text-3xl font-black text-slate-100">{getTotalTickets()}</p>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-500/25 to-emerald-600/25 backdrop-blur-xl rounded-xl p-6 border border-emerald-500/60 shadow-lg text-center">
                  <p className="text-sm font-bold uppercase tracking-wide text-emerald-300 mb-2">Total</p>
                  <p className="text-4xl font-black text-emerald-100">
                    ${getTotalPrice().toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 p-4 bg-rose-500/20 backdrop-blur-xl border border-rose-500/50 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-rose-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <p className="text-sm text-rose-150 font-medium flex-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Book Button */}
              <button
                onClick={handleBooking}
                disabled={
                  getTotalTickets() === 0 || 
                  bookingLoading ||
                  (event.allocationMode === "MANUAL" && selectedSeats.length !== getTotalTickets())
                }
                className={`w-full h-14 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center ${
                  getTotalTickets() === 0 || 
                  bookingLoading ||
                  (event.allocationMode === "MANUAL" && selectedSeats.length !== getTotalTickets())
                    ? 'bg-slate-800/70 border border-slate-700/70 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-95'
                }`}
              >
                {bookingLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : event.allocationMode === "MANUAL" && selectedSeats.length !== getTotalTickets() ? (
                  `Pick ${getTotalTickets()} Seat${getTotalTickets() !== 1 ? 's' : ''}`
                ) : (
                  'Confirm Booking'
                )}
              </button>

              <p className="text-slate-500 text-xs text-center mt-4 px-3 py-2 bg-slate-900/50 backdrop-blur-xl rounded-lg border border-slate-800/60">
                Booking confirmed instantly
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}