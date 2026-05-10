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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-xl text-center">
          <div className="w-10 h-10 border-4 border-slate-700/50 border-t-emerald-500 rounded-full mx-auto mb-4 animate-spin"></div>
          <p className="text-base text-slate-400 font-medium">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-xl text-center max-w-sm">
          <div className="w-12 h-12 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-black text-slate-200 mb-2">Event Not Found</h2>
          <p className="text-slate-500 text-sm mb-5">The event you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/organizer/events")}
            className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-emerald-500/40 hover:-translate-y-0.5 text-sm"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const isPublished = event.status === "PUBLISHED";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 text-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-5">

        {/* Header Section */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl p-5">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent tracking-tight mb-2 truncate">
                {event.title}
              </h1>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex px-3 py-1 rounded-xl text-xs font-bold shadow border backdrop-blur-sm ${isPublished
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-emerald-500/25'
                  : 'bg-rose-500/20 text-rose-300 border-rose-400/50 shadow-rose-500/25'
                  }`}>
                  {event.status}
                </span>
                <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-pulse"></div>
                <span className="text-slate-400 text-xs font-medium">ID: <span className="font-mono text-emerald-400">{eventId}</span></span>
              </div>
            </div>

            {!isPublished && (
              <button
                onClick={() => navigate(`/organizer/events/${eventId}/edit`)}
                className="group relative px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-slate-300 font-semibold rounded-xl hover:bg-slate-700/50 hover:border-slate-600/50 hover:text-slate-200 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap flex-shrink-0 text-sm"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-slate-400/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-xl" />
                <span className="relative flex items-center">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Event
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Event Details Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl p-5">
          <h2 className="text-base font-black text-slate-100 mb-5 flex items-center">
            <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Event Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
                <p className="text-sm text-slate-200 p-3 bg-slate-800/30 rounded-xl border border-slate-700/50 leading-relaxed">
                  {event.description || "No description provided"}
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Start Time</label>
                <p className="text-sm font-semibold text-slate-100 p-3 bg-slate-800/30 rounded-xl border border-slate-700/50">
                  {new Date(event.startDateTime).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">End Time</label>
                <p className="text-sm font-semibold text-slate-100 p-3 bg-slate-800/30 rounded-xl border border-slate-700/50">
                  {new Date(event.endDateTime).toLocaleString()}
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Allocation Mode</label>
                <span className="inline-flex px-3 py-1.5 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl text-slate-300 font-semibold text-sm">
                  {event.allocationMode}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Link
          to={`/organizer/events/${eventId}/seats`}
          className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors text-sm"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Manage Seats
        </Link>

        {/* Setup Steps - Only if not published */}
        {!isPublished && (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-b border-slate-700/50 p-4">
              <h2 className="text-base font-black text-slate-100 flex items-center">
                <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Setup Progress
              </h2>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <Link
                to={`/organizer/events/${eventId}/venue/create`}
                className="group relative p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-emerald-500/30 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/10 to-emerald-400/0 -skew-x-12 opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-x-full group-hover:translate-x-full rounded-xl" />
                <div className="relative flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 border-2 border-white/20">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-100 mb-1 group-hover:text-emerald-400 transition-colors">1. Venue</h3>
                    <p className="text-slate-400 text-xs font-medium">Layout & Capacity</p>
                  </div>
                </div>
              </Link>

              <Link
                to={`/organizer/events/${eventId}/seat-categories`}
                className="group relative p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:shadow-purple-500/30 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-purple-400/10 to-purple-400/0 -skew-x-12 opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-x-full group-hover:translate-x-full rounded-xl" />
                <div className="relative flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 border-2 border-white/20">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-100 mb-1 group-hover:text-purple-400 transition-colors">2. Seat Categories</h3>
                    <p className="text-slate-400 text-xs font-medium">VIP, Regular, etc.</p>
                  </div>
                </div>
              </Link>

              <Link
                to={`/organizer/events/${eventId}/tickets`}
                className="group relative p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:bg-rose-500/20 hover:border-rose-500/50 transition-all duration-300 hover:shadow-rose-500/30 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-rose-400/0 via-rose-400/10 to-rose-400/0 -skew-x-12 opacity-0 group-hover:opacity-100 transition-all duration-700 -translate-x-full group-hover:translate-x-full rounded-xl" />
                <div className="relative flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 border-2 border-white/20">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1 5h9l-1-5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-100 mb-1 group-hover:text-rose-400 transition-colors">3. Tickets</h3>
                    <p className="text-slate-400 text-xs font-medium">Pricing & Mapping</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-rose-200 font-semibold text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl p-4 flex flex-col sm:flex-row gap-3 justify-end">
          {!isPublished && (
            <button
              onClick={publishEvent}
              disabled={publishing}
              className="group relative flex-1 sm:flex-none sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-emerald-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-sm overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative flex items-center justify-center">
                {publishing ? (
                  <>
                    <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Publishing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Publish Event
                  </>
                )}
              </span>
            </button>
          )}

          {!isPublished && (
            <button
              onClick={handleDeleteEvent}
              disabled={deleting}
              className="group relative px-5 py-2.5 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/50 text-rose-300 font-semibold rounded-xl transition-all duration-300 hover:shadow-rose-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <span className="relative flex items-center justify-center">
                {deleting ? (
                  <>
                    <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="group relative px-5 py-2.5 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-slate-300 font-semibold rounded-xl hover:bg-slate-700/50 hover:border-slate-600/50 hover:text-slate-200 transition-all duration-300 hover:shadow-md hover:shadow-slate-500/20 hover:-translate-y-0.5 text-sm"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-slate-400/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-xl" />
            <span className="relative flex items-center justify-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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