// src/pages/organizer/Events/View.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { organizerApi } from "../../../api/organizer.api";
import { Link } from "react-router-dom";


export default function OrganizerEventView() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    organizerApi
      .getEventById(eventId)
      .then((res) => {
        setEvent(res.data.data);
      })
      .catch(() => {
        setError("Failed to load event");
      })
      .finally(() => setLoading(false));
  }, [eventId]);

  async function publishEvent() {
    setPublishing(true);
    setError("");

    try {
      await organizerApi.publishEvent(eventId);
      const res = await organizerApi.getEventById(eventId);
      setEvent(res.data.data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Event cannot be published yet"
      );
    } finally {
      setPublishing(false);
    }
  }
  async function handleDeleteEvent() {
    if (!confirm(`Are you sure you want to delete "${event.title}"? This action cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    try {
      await organizerApi.deleteEvent(eventId);
      navigate("/organizer/events");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete event");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 flex items-center justify-center p-8">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-slate-700/50 shadow-2xl text-center">
          <div className="w-16 h-16 border-4 border-slate-700/50 border-t-emerald-500 rounded-full mx-auto mb-6 animate-spin"></div>
          <p className="text-xl text-slate-400 font-medium">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 flex items-center justify-center p-8">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-slate-700/50 shadow-2xl text-center max-w-md">
          <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-200 mb-4">Event Not Found</h2>
          <p className="text-slate-500 mb-8">The event you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/organizer/events")}
            className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all duration-300 shadow-xl hover:shadow-emerald-500/50 hover:-translate-y-1"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const isPublished = event.status === "PUBLISHED";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* Header Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-4xl border border-slate-700/50 shadow-2xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="flex-1 min-w-0">
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent tracking-tight mb-4 truncate">
                {event.title}
              </h1>
              <div className="flex items-center space-x-4">
                <span className={`inline-flex px-4 py-2 rounded-2xl text-sm font-bold shadow-lg border backdrop-blur-sm ${isPublished
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-emerald-500/25'
                  : 'bg-rose-500/20 text-rose-300 border-rose-400/50 shadow-rose-500/25'
                  }`}>
                  {event.status}
                </span>
                <div className="w-2 h-2 bg-slate-500 rounded-full animate-pulse"></div>
                <span className="text-slate-400 font-medium">Event ID: <span className="font-mono text-emerald-400">{eventId}</span></span>
              </div>
            </div>

            {!isPublished && (
              <button
                onClick={() => navigate(`/organizer/events/${eventId}/edit`)}
                className="group relative px-8 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-slate-300 font-bold rounded-3xl hover:bg-slate-700/50 hover:border-slate-600/50 hover:text-slate-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 whitespace-nowrap flex-shrink-0"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-slate-400/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Event
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Event Details Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-4xl border border-slate-700/50 shadow-2xl p-8">
          <h2 className="text-2xl font-black text-slate-100 mb-8 flex items-center">
            <svg className="w-8 h-8 mr-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Event Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Description</label>
                <p className="text-lg text-slate-200 p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50 leading-relaxed">
                  {event.description || "No description provided"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Start Time</label>
                <p className="text-xl font-semibold text-slate-100 p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                  {new Date(event.startDateTime).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">End Time</label>
                <p className="text-xl font-semibold text-slate-100 p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                  {new Date(event.endDateTime).toLocaleString()}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Allocation Mode</label>
                <span className="inline-flex px-6 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl text-slate-300 font-semibold text-lg">
                  {event.allocationMode}
                </span>
              </div>
            </div>
          </div>
        </div>
        <Link
          to={`/organizer/events/${eventId}/seats`}
          className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Manage Seats
        </Link>

        {/* Setup Steps - Only if not published */}
        {!isPublished && (
          <div className="bg-white/5 backdrop-blur-xl rounded-4xl border border-slate-700/50 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-b border-slate-700/50 p-8">
              <h2 className="text-3xl font-black text-slate-100 flex items-center">
                <svg className="w-10 h-10 mr-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Setup Progress
              </h2>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link
                to={`/organizer/events/${eventId}/venue/create`}
                className="group relative p-8 rounded-3xl bg-slate-800/30 border border-slate-700/50 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-emerald-500/30 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/10 to-emerald-400/0 -skew-x-12 opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-x-full group-hover:translate-x-full" />
                <div className="relative flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-500 border-4 border-white/20">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-100 mb-2 group-hover:text-emerald-400 transition-colors">1. Venue</h3>
                    <p className="text-slate-400 text-sm font-medium">Layout & Capacity</p>
                  </div>
                </div>
              </Link>

              <Link
                to={`/organizer/events/${eventId}/seat-categories`}
                className="group relative p-8 rounded-3xl bg-slate-800/30 border border-slate-700/50 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:shadow-purple-500/30 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/10 to-purple-400/0 -skew-x-12 opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-x-full group-hover:translate-x-full" />
                <div className="relative flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-500 border-4 border-white/20">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-100 mb-2 group-hover:text-purple-400 transition-colors">2. Seat Categories</h3>
                    <p className="text-slate-400 text-sm font-medium">VIP, Regular, etc.</p>
                  </div>
                </div>
              </Link>

              <Link
                to={`/organizer/events/${eventId}/tickets`}
                className="group relative p-8 rounded-3xl bg-slate-800/30 border border-slate-700/50 hover:bg-rose-500/20 hover:border-rose-500/50 transition-all duration-300 hover:shadow-rose-500/30 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-rose-400/0 via-rose-400/10 to-rose-400/0 -skew-x-12 opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-x-full group-hover:translate-x-full" />
                <div className="relative flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-rose-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-500 border-4 border-white/20">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1 5h9l-1-5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-100 mb-2 group-hover:text-rose-400 transition-colors">3. Tickets</h3>
                    <p className="text-slate-400 text-sm font-medium">Pricing & Mapping</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}
        {/* Action Buttons */}
        <div className="bg-white/5 backdrop-blur-xl rounded-4xl border border-slate-700/50 shadow-2xl p-8 flex flex-col sm:flex-row gap-4 justify-end">
          {!isPublished && (
            <button
              onClick={publishEvent}
              disabled={publishing}
              className="group relative flex-1 sm:w-auto px-10 py-6 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-black rounded-3xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/50 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed text-lg overflow-hidden"
            >
              {/* ... existing publish button code ... */}
            </button>
          )}

          {/* NEW: Delete Button (only for DRAFT events) */}
          {!isPublished && (
            <button
              onClick={handleDeleteEvent}
              disabled={deleting}
              className="group relative px-10 py-6 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/50 text-rose-300 font-bold rounded-3xl transition-all duration-300 hover:shadow-rose-500/50 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 text-lg"
            >
              <span className="relative flex items-center justify-center">
                {deleting ? (
                  <>
                    <svg className="w-5 h-5 mr-3 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Event
                  </>
                )}
              </span>
            </button>
          )}

          <button
            onClick={() => navigate("/organizer/events")}
            className="group relative px-10 py-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-slate-300 font-bold rounded-3xl hover:bg-slate-700/50 hover:border-slate-600/50 hover:text-slate-200 transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/30 hover:-translate-y-1 flex-shrink-0 text-lg"
          >
            {/* ... existing back button code ... */}
          </button>
        </div>
        {/* Error Alert */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-3xl p-8 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <svg className="w-8 h-8 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-rose-200 font-bold text-lg">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-white/5 backdrop-blur-xl rounded-4xl border border-slate-700/50 shadow-2xl p-8 flex flex-col sm:flex-row gap-4 justify-end">
          {!isPublished && (
            <button
              onClick={publishEvent}
              disabled={publishing}
              className="group relative flex-1 sm:w-auto px-10 py-6 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-black rounded-3xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/50 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative flex items-center justify-center">
                {publishing ? (
                  <>
                    <svg className="w-5 h-5 mr-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Publishing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Publish Event
                  </>
                )}
              </span>
            </button>
          )}

          <button
            onClick={() => navigate("/organizer/events")}
            className="group relative px-10 py-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-slate-300 font-bold rounded-3xl hover:bg-slate-700/50 hover:border-slate-600/50 hover:text-slate-200 transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/30 hover:-translate-y-1 flex-shrink-0 text-lg"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-slate-400/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative flex items-center justify-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Events
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
