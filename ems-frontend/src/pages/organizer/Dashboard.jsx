/* eslint-disable react-hooks/immutability */
// src/pages/organizer/Dashboard.jsx - OPTIMIZED SIZING
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { organizerApi } from "../../api/organizer.api";

export default function OrganizerDashboard() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    publishedEvents: 0,
    draftEvents: 0,
    totalTicketsSold: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const eventsRes = await organizerApi.getMyEvents();
      const eventsData = eventsRes.data.data;
      setEvents(eventsData);

      let totalTicketsSold = 0;
      let totalRevenue = 0;

      for (const event of eventsData) {
        try {
          const bookingsRes = await organizerApi.getEventBookings(event.id);
          const bookings = bookingsRes.data.data;

          bookings.forEach(booking => {
            if (booking.status === 'CONFIRMED' && booking.issuedTickets) {
              const ticketCount = booking.issuedTickets.length;
              totalTicketsSold += ticketCount;

              booking.issuedTickets.forEach(ticket => {
                if (ticket.ticketType && ticket.ticketType.price) {
                  totalRevenue += parseFloat(ticket.ticketType.price);
                }
              });
            }
          });
        } catch (err) {
          console.log(`No bookings for event ${event.id}:`, err.message);
        }
      }

      setStats({
        totalEvents: eventsData.length,
        publishedEvents: eventsData.filter(e => e.status === "PUBLISHED").length,
        draftEvents: eventsData.filter(e => e.status === "DRAFT").length,
        totalTicketsSold,
        totalRevenue,
      });

      setLoading(false);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
        
        {/* Hero Section - Compact */}
        <div className="text-center space-y-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl lg:rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent tracking-tight">
              Organizer Dashboard
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-slate-400 font-medium max-w-2xl mx-auto px-4">
              {loading ? 'Loading your events...' : `${stats.totalEvents} events ready to manage`}
            </p>
          </div>
          <Link
            to="/organizer/events/create"
            className="group inline-flex items-center px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-sm sm:text-base lg:text-lg font-bold text-white rounded-xl lg:rounded-2xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-xl hover:shadow-emerald-500/50 hover:-translate-y-1 border border-emerald-600/50"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New Event
          </Link>
        </div>

        {/* Main Scoreboard - Compact */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl lg:rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden">
          
          {/* Scoreboard Header - Reduced padding */}
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-b border-slate-700/50 p-4 sm:p-5 lg:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-xl"></div>
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-100 tracking-tight">Event Overview</h2>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wider hidden sm:block">Your control center</p>
                </div>
              </div>
              {!loading && (
                <button
                  onClick={loadDashboardData}
                  className="px-3 py-1.5 lg:px-4 lg:py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-xs lg:text-sm font-medium transition-colors"
                  title="Refresh stats"
                >
                  🔄 Refresh
                </button>
              )}
            </div>
          </div>

          {/* Scoreboard Stats Row - Compact Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-slate-800/30">
            
            {/* Total Events */}
            <div className="p-4 sm:p-5 lg:p-6 text-center group hover:bg-emerald-500/5 transition-all duration-300">
              <div className="text-2xl sm:text-3xl font-black text-slate-100 mb-2 group-hover:text-emerald-400 transition-colors duration-300">
                {loading ? '—' : stats.totalEvents}
              </div>
              <div className="space-y-0.5">
                <p className="text-emerald-400 font-bold text-xs sm:text-sm uppercase tracking-wider">Total Events</p>
                <p className="text-slate-500 text-xs hidden sm:block">All events</p>
              </div>
            </div>

            {/* Published Events */}
            <div className="p-4 sm:p-5 lg:p-6 text-center group hover:bg-blue-500/5 transition-all duration-300">
              <div className="text-2xl sm:text-3xl font-black text-slate-100 mb-2 group-hover:text-blue-400 transition-colors duration-300">
                {loading ? '—' : stats.publishedEvents}
              </div>
              <div className="space-y-0.5">
                <p className="text-blue-400 font-bold text-xs sm:text-sm uppercase tracking-wider">Published</p>
                <p className="text-slate-500 text-xs hidden sm:block">Live now</p>
              </div>
            </div>

            {/* Tickets Sold */}
            <div className="p-4 sm:p-5 lg:p-6 text-center group hover:bg-rose-500/5 transition-all duration-300">
              <div className="text-2xl sm:text-3xl font-black text-slate-100 mb-2 group-hover:text-rose-400 transition-colors duration-300">
                {loading ? '—' : stats.totalTicketsSold}
              </div>
              <div className="space-y-0.5">
                <p className="text-rose-400 font-bold text-xs sm:text-sm uppercase tracking-wider">Tickets Sold</p>
                <p className="text-slate-500 text-xs hidden sm:block">All bookings</p>
              </div>
            </div>

            {/* Revenue */}
            <div className="p-4 sm:p-5 lg:p-6 text-center group hover:bg-purple-500/5 transition-all duration-300">
              <div className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-100 mb-2 group-hover:text-purple-400 transition-colors duration-300">
                {loading ? '—' : `₹${stats.totalRevenue.toLocaleString('en-IN')}`}
              </div>
              <div className="space-y-0.5">
                <p className="text-purple-400 font-bold text-xs sm:text-sm uppercase tracking-wider">Revenue</p>
                <p className="text-slate-500 text-xs hidden sm:block">Total earnings</p>
              </div>
            </div>

          </div>

          {/* Recent Events Section - Compact */}
          <div className="border-t border-slate-800/30">
            <div className="p-4 sm:p-5 lg:p-6">
              <div className="flex items-center justify-between mb-4 lg:mb-5">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-100 flex items-center">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                  Recent Events
                </h3>
                <Link 
                  to="/organizer/events" 
                  className="text-emerald-400 hover:text-emerald-300 font-semibold text-xs sm:text-sm flex items-center transition-colors duration-200"
                >
                  View All → 
                </Link>
              </div>

              {/* Events List - Compact */}
              <div className="space-y-2 lg:space-y-3 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 border-4 border-slate-700/50 border-t-emerald-500 rounded-full animate-spin"></div>
                      <p className="text-slate-500 text-sm font-medium">Loading events...</p>
                    </div>
                  </div>
                ) : events.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-14 h-14 lg:w-16 lg:h-16 bg-slate-800/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-7 h-7 lg:w-9 lg:h-9 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h4 className="text-base lg:text-lg font-bold text-slate-400 mb-2">No events yet</h4>
                    <p className="text-sm text-slate-600 mb-4">Get started by creating your first event</p>
                    <Link
                      to="/organizer/events/create"
                      className="inline-flex items-center px-4 py-2 lg:px-5 lg:py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-all duration-200"
                    >
                      Create First Event
                    </Link>
                  </div>
                ) : (
                  events.slice(0, 5).map((event) => (
                    <Link
                      key={event.id}
                      to={`/organizer/events/${event.id}`}
                      className="group flex items-center p-3 sm:p-4 rounded-xl lg:rounded-2xl bg-white/5 hover:bg-emerald-500/10 border border-slate-800/50 hover:border-emerald-500/50 hover:shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-300">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0 ml-3">
                        <h4 className="font-bold text-sm lg:text-base text-slate-100 group-hover:text-emerald-400 transition-colors duration-300 truncate">
                          {event.title}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center mt-0.5">
                          <span className="w-1 h-1 bg-slate-500 rounded-full mr-1.5"></span>
                          {new Date(event.startDateTime).toLocaleDateString('en-IN', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        {event.status && (
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold mt-1 ${
                            event.status === 'PUBLISHED' 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
                              : event.status === 'DRAFT' 
                              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                              : 'bg-slate-700/50 text-slate-400 border border-slate-700/50'
                          }`}>
                            {event.status}
                          </span>
                        )}
                      </div>
                      <svg className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 ml-2 transition-colors duration-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}