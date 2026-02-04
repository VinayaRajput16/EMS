// src/pages/user/Events/BrowseEvents.jsx - REFINED USER-FRIENDLY DESIGN
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { userApi } from "../../../api/user.api";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function BrowseEvents() {
  const { userId } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    userApi.getAllPublishedEvents()
      .then(res => {
        setEvents(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.message || "Failed to load events");
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 text-white p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent tracking-tight mb-4">
            Discover Events
          </h1>
          <p className="text-lg text-slate-400 max-w-lg mx-auto">
            Find and book tickets for amazing live experiences
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 max-w-2xl mx-auto">
            <p className="text-rose-200 font-medium text-base">{error}</p>
          </div>
        )}

        {/* Events Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner className="w-10 h-10 text-emerald-400" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-700/50">
              <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-300 mb-2">No Events Available</h3>
            <p className="text-slate-500 text-base">Check back later for upcoming events</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link
                key={event.id}
                to={`/user/${userId}/events/${event.id}`}
                className="group bg-white/5 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl border border-white/10 overflow-hidden hover:-translate-y-2 transition-all duration-300 hover:border-emerald-500/30"
              >
                {/* Event Image */}
                <div className="h-48 relative overflow-hidden bg-gradient-to-br from-slate-800/70 to-slate-900/70">
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <svg className="w-16 h-16 text-white/50 group-hover:text-emerald-300 group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  {/* Event Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-4 py-2 bg-emerald-500/90 backdrop-blur text-white font-semibold text-xs rounded-xl shadow-lg">
                      LIVE
                    </span>
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-emerald-300 transition-colors">
                    {event.title}
                  </h3>
                  
                  {event.description && (
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>
                  )}

                  {/* Event Details */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-slate-300">
                      <svg className="w-4 h-4 mr-2 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(event.startDateTime)}</span>
                    </div>

                    {event.venue && (
                      <div className="flex items-center text-sm text-slate-300">
                        <svg className="w-4 h-4 mr-2 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{event.venue.name}</span>
                      </div>
                    )}

                    {event.organizer && (
                      <div className="flex items-center text-sm text-slate-300">
                        <svg className="w-4 h-4 mr-2 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>By {event.organizer.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Book Button */}
                  <div className="pt-4 border-t border-slate-800/50">
                    <div className="group/btn px-6 py-3 bg-gradient-to-r from-emerald-600/90 to-emerald-700/90 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold text-base rounded-2xl text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 backdrop-blur border border-emerald-500/50">
                      View Details & Book →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination Placeholder */}
        {events.length > 0 && (
          <div className="mt-12 flex justify-center">
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all duration-200">Previous</button>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 font-semibold">1</button>
              <button className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all duration-200">2</button>
              <button className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all duration-200">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
