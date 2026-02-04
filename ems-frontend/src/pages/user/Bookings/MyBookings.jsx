// src/pages/user/Bookings/MyBookings.jsx - ELITE DARK THEME
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

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancelBooking = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

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
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 ring-emerald-500/30';
      case 'PENDING':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-amber-500/30';
      case 'CANCELLED':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 ring-rose-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40 ring-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 text-white p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center mb-4">
            <Link to={`/user/${userId}/dashboard`} className="group inline-flex items-center text-slate-400 hover:text-emerald-400 transition-colors mr-4">
              <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Dashboard
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              My Bookings
            </h1>
          </div>
          <p className="text-slate-400 text-lg">View and manage your event bookings</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-rose-500/10 backdrop-blur-xl border border-rose-500/30 rounded-2xl p-6">
            <p className="text-rose-200 font-medium">{error}</p>
          </div>
        )}

        {/* Bookings List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner className="w-10 h-10 text-emerald-400" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center border border-white/20">
            <div className="w-20 h-20 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-700/50">
              <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-300 mb-4">No Bookings Yet</h3>
            <p className="text-slate-500 mb-8">Start exploring events and make your first booking!</p>
            <Link
              to={`/user/${userId}/events`}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-2xl shadow-lg hover:shadow-emerald-500/50 hover:-translate-y-1 transition-all duration-300 border border-emerald-500/50"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c0 4.97-4.03 9-9 9a9.28 9.28 0 01-4.25-.97L3 20v-4.25A9.28 9.28 0 013 12c0-4.97 4.03-9 9-9s9 4.03 9 9z" />
              </svg>
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="group bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl border border-white/20 overflow-hidden hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-3 line-clamp-2 group-hover:text-emerald-300 transition-colors">
                        {booking.event?.title || "Event"}
                      </h3>
                      <div className="flex items-center space-x-6 text-sm text-slate-400 mb-4">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(booking.createdAt)}
                        </span>
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                          </svg>
                          {booking.issuedTickets?.length || 0} Ticket(s)
                        </span>
                      </div>
                    </div>
                    <span className={`px-6 py-3 rounded-2xl font-semibold text-sm ring-2 shadow-lg ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>

                  {/* Ticket Details */}
                  {booking.issuedTickets && booking.issuedTickets.length > 0 && (
                    <div className="mb-8 p-6 bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/50">
                      <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        Tickets
                      </h4>
                      <div className="space-y-3">
                        {booking.issuedTickets.map((ticket, index) => {
                          const categoryName = ticket.ticketType?.mappings && ticket.ticketType.mappings.length > 0
                            ? ticket.ticketType.mappings[0].seatCategory?.name
                            : ticket.ticketType?.name || "General";
                          
                          return (
                            <div key={ticket.id} className="flex items-center justify-between py-3 px-4 bg-white/5 rounded-xl border border-white/10">
                              <span className="text-slate-300">
                                Ticket {index + 1}: <span className="font-semibold text-white">{categoryName}</span>
                                {ticket.seat && (
                                  <span className="ml-3 px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full">
                                    🪑 {ticket.seat.label}
                                  </span>
                                )}
                              </span>
                              <span className="font-bold text-emerald-400 text-lg">
                                ${parseFloat(ticket.ticketType?.price || 0).toFixed(2)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center space-x-4 pt-4 border-t border-slate-800/50">
                    <Link
                      to={`/user/${userId}/bookings/${booking.id}`}
                      className="flex-1 group flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600/90 to-blue-700/90 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl shadow-lg hover:shadow-blue-500/50 hover:-translate-y-1 transition-all duration-300 border border-blue-500/50 backdrop-blur"
                    >
                      <span className="group-hover:mr-2 transition-all duration-300">View Details</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    {booking.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={cancellingId === booking.id}
                        className="px-6 py-4 bg-gradient-to-r from-rose-600/90 to-rose-700/90 hover:from-rose-700 hover:to-rose-800 text-white font-semibold rounded-2xl shadow-lg hover:shadow-rose-500/50 hover:-translate-y-1 transition-all duration-300 border border-rose-500/50 backdrop-blur disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
                      >
                        {cancellingId === booking.id ? (
                          <svg className="w-5 h-5 animate-spin mx-auto" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          'Cancel'
                        )}
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
