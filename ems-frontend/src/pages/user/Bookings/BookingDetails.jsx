// src/pages/user/Bookings/BookingDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { userApi } from "../../../api/user.api";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function BookingDetails() {
  const { userId, bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchBookingDetails = async () => {
      try {
        const res = await userApi.getBookingDetails(bookingId);
        if (isMounted) { setBooking(res.data.data); setLoading(false); }
      } catch (err) {
        if (isMounted) { setError(err.response?.data?.message || "Failed to load booking details"); setLoading(false); }
      }
    };
    fetchBookingDetails();
    return () => { isMounted = false; };
  }, [bookingId]);

  const handleCancelBooking = async () => {
    if (!confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) return;
    setCancelling(true);
    try {
      await userApi.cancelBooking(bookingId);
      navigate(`/user/${userId}/bookings`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking");
      setCancelling(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-500/30';
      case 'PENDING':   return 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-1 ring-amber-500/30';
      case 'CANCELLED': return 'bg-rose-500/20 text-rose-300 border-rose-500/40 ring-1 ring-rose-500/30';
      default:          return 'bg-slate-500/20 text-slate-300 border-slate-500/40 ring-1 ring-slate-500/30';
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-4">
      <LoadingSpinner className="w-8 h-8 text-emerald-400" />
    </div>
  );

  if (error || !booking) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl max-w-sm">
        <h2 className="text-lg font-bold text-slate-300 mb-4">{error || "Booking Not Found"}</h2>
        <Link to={`/user/${userId}/bookings`} className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl shadow text-sm hover:-translate-y-0.5 transition-all">
          ← Back to Bookings
        </Link>
      </div>
    </div>
  );

  const totalAmount = booking.issuedTickets?.reduce((sum, t) => sum + parseFloat(t.ticketType?.price || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 text-white p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">

        <Link
          to={`/user/${userId}/bookings`}
          className="group mb-6 inline-flex items-center px-4 py-2 bg-white/5 border border-white/20 text-slate-300 hover:text-emerald-400 hover:bg-white/10 hover:border-emerald-500/40 rounded-xl shadow text-sm transition-all duration-300 font-medium"
        >
          <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Bookings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Main Info */}
          <div className="lg:col-span-2 space-y-4">

            {/* Header */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl font-black bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent mb-1">
                    Booking #{booking.id?.substring(0, 8)}...
                  </h1>
                  <p className="text-slate-400 text-xs">ID: <code className="bg-slate-800/50 px-2 py-0.5 rounded-lg font-mono border border-slate-700/50">{booking.id}</code></p>
                </div>
                <span className={`px-3 py-1.5 rounded-xl font-bold text-sm shadow ring-1 ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>
            </div>

            {/* Event Info */}
            {booking.event && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-md">
                <h2 className="text-base font-bold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Event Details
                </h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-slate-400 mb-0.5 text-xs">Event Name</p>
                    <p className="text-lg font-bold text-white">{booking.event.title}</p>
                  </div>
                  {booking.event.description && (
                    <div>
                      <p className="text-slate-400 mb-0.5 text-xs">Description</p>
                      <p className="text-slate-200 leading-relaxed">{booking.event.description}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-800/50">
                    <div>
                      <p className="text-slate-400 mb-0.5 text-xs">Start Time</p>
                      <p className="text-emerald-300 font-semibold text-xs">{formatDate(booking.event.startDateTime)}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-0.5 text-xs">End Time</p>
                      <p className="text-emerald-300 font-semibold text-xs">{formatDate(booking.event.endDateTime)}</p>
                    </div>
                    {booking.event.venue && (
                      <div>
                        <p className="text-slate-400 mb-0.5 text-xs">Venue</p>
                        <p className="font-semibold text-white text-xs">{booking.event.venue.name}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tickets */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-md">
              <h2 className="text-base font-bold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                Your Tickets ({booking.issuedTickets?.length || 0})
              </h2>

              {booking.issuedTickets?.length > 0 ? (
                <div className="space-y-3">
                  {booking.issuedTickets.map((ticket, index) => {
                    const categoryName = ticket.ticketType?.mappings?.length > 0
                      ? ticket.ticketType.mappings[0].seatCategory?.name
                      : ticket.ticketType?.name || "General";
                    return (
                      <div key={ticket.id} className="bg-white/5 rounded-xl p-4 border border-white/15 hover:border-emerald-500/40 transition-all">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-sm text-white">Ticket #{index + 1}</h4>
                            <p className="text-slate-400 text-xs mb-1">{categoryName}</p>
                            {ticket.seat ? (
                              <span className="inline-flex items-center px-2.5 py-1 bg-emerald-500/20 text-emerald-300 font-semibold rounded-lg border border-emerald-500/40 text-xs">
                                Seat {ticket.seat.label}
                              </span>
                            ) : (
                              <p className="text-slate-500 italic text-xs">No seat assigned yet</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-black text-emerald-400">${parseFloat(ticket.ticketType?.price || 0).toFixed(2)}</p>
                            <p className="text-xs text-slate-500 font-mono">{ticket.id.substring(0, 8)}...</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="pt-4 border-t border-slate-800/50 flex justify-between items-center">
                    <span className="font-bold text-white">Total Amount</span>
                    <span className="text-xl font-black text-emerald-400">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500 text-sm">No tickets found for this booking</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-xl lg:sticky lg:top-4">
              <h2 className="text-sm font-bold text-white mb-4">Booking Info</h2>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-800/50">
                  <span className="text-slate-400">Booking Date</span>
                  <span className="font-semibold text-white text-right max-w-[60%]">{formatDate(booking.createdAt)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800/50">
                  <span className="text-slate-400">Total Tickets</span>
                  <span className="font-bold text-emerald-400">{booking.issuedTickets?.length || 0}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Status</span>
                  <span className={`px-2.5 py-1 rounded-lg font-bold text-xs ring-1 ${getStatusColor(booking.status)}`}>{booking.status}</span>
                </div>
              </div>
            </div>

            {booking.status === 'CONFIRMED' && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-md">
                <h2 className="text-sm font-bold text-white mb-3">Quick Actions</h2>
                <button
                  onClick={handleCancelBooking}
                  disabled={cancelling}
                  className="w-full flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-rose-600/90 to-rose-700/90 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-sm rounded-xl shadow hover:shadow-rose-500/40 hover:-translate-y-0.5 transition-all duration-300 border border-rose-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
                >
                  {cancelling ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Cancel Booking
                    </>
                  )}
                </button>
                <p className="text-slate-500 text-xs mt-2 text-center">Cancelling will release your tickets</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}