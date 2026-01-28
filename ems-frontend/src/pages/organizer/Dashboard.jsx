// src/pages/organizer/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

export default function OrganizerDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/events/my").then(res => {
      setEvents(res.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl mb-8">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-black bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent tracking-tight">
              Organizer Dashboard
            </h1>
            <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">
              {loading ? 'Loading your events...' : `${events.length} events ready to manage`}
            </p>
          </div>
          <Link
            to="/organizer/events/create"
            className="group inline-flex items-center px-10 py-5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-xl font-bold text-white rounded-3xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/50 hover:-translate-y-1 border border-emerald-600/50"
          >
            <svg className="w-6 h-6 mr-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New Event
          </Link>
        </div>

        {/* Main Scoreboard */}
        <div className="bg-white/5 backdrop-blur-xl rounded-4xl border border-slate-700/50 shadow-2xl overflow-hidden">
          
          {/* Scoreboard Header */}
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-b border-slate-700/50 p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl"></div>
                <div>
                  <h2 className="text-3xl font-black text-slate-100 tracking-tight">Event Overview</h2>
                  <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Your control center</p>
                </div>
              </div>
            </div>
          </div>

          {/* Scoreboard Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-slate-800/30">
            
            {/* Total Events */}
            <div className="p-8 text-center group hover:bg-emerald-500/5 transition-all duration-300 border-r md:border-r-slate-800/30">
              <div className="text-4xl font-black text-slate-100 mb-4 group-hover:text-emerald-400 transition-colors duration-300">
                {loading ? '—' : events.length}
              </div>
              <div className="space-y-1">
                <p className="text-emerald-400 font-bold text-lg uppercase tracking-wider">Total Events</p>
                <p className="text-slate-500 text-sm">Events you're managing</p>
              </div>
            </div>

            {/* Tickets */}
            <div className="p-8 text-center group hover:bg-rose-500/5 transition-all duration-300 border-r md:border-r-slate-800/30">
              <div className="text-4xl font-black text-slate-100 mb-4">0</div>
              <div className="space-y-1">
                <p className="text-rose-400 font-bold text-lg uppercase tracking-wider">Total Tickets</p>
                <p className="text-slate-500 text-sm">Sold across events</p>
              </div>
            </div>

            {/* Revenue */}
            <div className="p-8 text-center group hover:bg-purple-500/5 transition-all duration-300">
              <div className="text-4xl font-black text-slate-100 mb-4">₹0</div>
              <div className="space-y-1">
                <p className="text-purple-400 font-bold text-lg uppercase tracking-wider">Revenue</p>
                <p className="text-slate-500 text-sm">Total earnings</p>
              </div>
            </div>

          </div>

          {/* Recent Events Section */}
          <div className="border-t border-slate-800/30">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-slate-100 flex items-center">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                  Recent Events
                </h3>
                <Link 
                  to="/organizer/events" 
                  className="text-emerald-400 hover:text-emerald-300 font-semibold text-sm flex items-center transition-colors duration-200"
                >
                  View All → 
                </Link>
              </div>

              {/* Events List */}
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-12 h-12 border-4 border-slate-700/50 border-t-emerald-500 rounded-full animate-spin"></div>
                      <p className="text-slate-500 font-medium">Loading events...</p>
                    </div>
                  </div>
                ) : events.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-slate-400 mb-2">No events yet</h4>
                    <p className="text-slate-600 mb-6">Get started by creating your first event</p>
                    <Link
                      to="/organizer/events/create"
                      className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-2xl hover:bg-emerald-700 transition-all duration-200"
                    >
                      Create First Event
                    </Link>
                  </div>
                ) : (
                  events.slice(0, 5).map((event) => (
                    <Link
                      key={event.id}
                      to={`/organizer/events/${event.id}`}
                      className="group flex items-center p-6 rounded-2xl bg-white/5 hover:bg-emerald-500/10 border border-slate-800/50 hover:border-emerald-500/50 hover:shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0 ml-4">
                        <h4 className="font-bold text-slate-100 group-hover:text-emerald-400 transition-colors duration-300 truncate">
                          {event.title}
                        </h4>
                        <p className="text-sm text-slate-500 flex items-center mt-1">
                          <span className="w-1.5 h-1.5 bg-slate-500 rounded-full mr-2"></span>
                          ID: <span className="font-mono ml-1">{event.id}</span>
                        </p>
                        {event.status && (
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold mt-2 ${
                            event.status === 'active' 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' 
                              : event.status === 'draft' 
                              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                              : 'bg-slate-700/50 text-slate-400 border border-slate-700/50'
                          }`}>
                            {event.status.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <svg className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 ml-4 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
