// src/pages/user/Bookings/MyBookings.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { userApi } from "../../../api/user.api";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function MyBookings() {
  const { userId } = useParams();
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  const loadBookings = () => {
    setLoading(true);
    userApi.getMyBookings()
      .then(res => {
        setBookings(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.message || "Failed to load bookings");
        setLoading(false);
      });
  };

  useEffect(() => { loadBookings(); }, []);

  const handleCancelBooking = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setCancellingId(orderId);
    try {
      await userApi.cancelBooking(orderId);
      loadBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 text-white p-4 lg:p-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <Link to={`/user/${userId}/dashboard`} className="group inline-flex items-center text-slate-400 hover:text-emerald-400 transition-colors mr-3 text-sm">
              <svg className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Dashboard
            </Link>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              My Bookings
            </h1>
          </div>
          <p className="text-slate-400 text-sm">View and manage your event bookings</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-rose-500/10 backdrop-blur-xl border border-rose-500/30 rounded-xl p-4">
            <p className="text-rose-200 font-medium text-sm">{error}</p>
          </div>
        )}

        {/* Bookings List */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner className="w-8 h-8 text-emerald-400" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-10 text-center border border-white/20">
            <div className="w-14 h-14 bg-slate-800/50 rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-700/50">
              <svg className="w-7 h-7 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-300 mb-2">No Bookings Yet</h3>
            <p className="text-slate-500 text-sm mb-6">Start exploring events and make your first booking!</p>
            <Link
              to={`/user/${userId}/events`}
              className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-xl shadow hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300 text-sm"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="group bg-white/10 backdrop-blur-xl rounded-2xl shadow-md hover:shadow-xl border border-white/20 overflow-hidden hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-white mb-2 line-clamp-1 group-hover:text-emerald-300 transition-colors">
                        {booking.event?.title || "Event"}
                      </h3>
                      <div className="flex items-center space-x-4 text-xs text-slate-400">
                        <span className="flex items-center">
                          <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(booking.createdAt)}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                          </svg>
                          {booking.issuedTickets?.length || 0} Ticket(s)
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-xl font-semibold text-xs ring-1 shadow ml-3 ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>

                  {/* Ticket Details */}
                  {booking.issuedTickets && booking.issuedTickets.length > 0 && (
                    <div className="mb-4 p-3 bg-slate-800/30 backdrop-blur-xl rounded-xl border border-slate-700/50">
                      <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wide">Tickets</h4>
                      <div className="space-y-1.5">
                        {booking.issuedTickets.map((ticket, index) => {
                          const categoryName = ticket.ticketType?.mappings?.length > 0
                            ? ticket.ticketType.mappings[0].seatCategory?.name
                            : ticket.ticketType?.name || "General";
                          return (
                            <div key={ticket.id} className="flex items-center justify-between py-1.5 px-3 bg-white/5 rounded-lg border border-white/10">
                              <span className="text-slate-300 text-xs">
                                #{index + 1}: <span className="font-semibold text-white">{categoryName}</span>
                                {ticket.seat && (
                                  <span className="ml-2 px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full">
                                    🪑 {ticket.seat.label}
                                  </span>
                                )}
                              </span>
                              <span className="font-bold text-emerald-400 text-sm">
                                ${parseFloat(ticket.ticketType?.price || 0).toFixed(2)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center space-x-3 pt-3 border-t border-slate-800/50">
                    <Link
                      to={`/user/${userId}/bookings/${booking.id}`}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600/90 to-blue-700/90 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow text-sm hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200"
                    >
                      View Details →
                    </Link>
                    {booking.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={cancellingId === booking.id}
                        className="px-4 py-2 bg-gradient-to-r from-rose-600/90 to-rose-700/90 hover:from-rose-700 hover:to-rose-800 text-white font-semibold rounded-xl shadow text-sm hover:shadow-rose-500/40 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
                      >
                        {cancellingId === booking.id ? (
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}