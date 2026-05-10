// src/pages/organizer/Events/Publish.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { organizerApi } from "../../../api/organizer.api";

export default function OrganizerEventPublish() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [venue, setVenue] = useState(null);
  const [seatCategories, setSeatCategories] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [eventRes, venueRes, scRes, ticketRes] = await Promise.all([
          organizerApi.getEventById(eventId),
          organizerApi.getVenueByEvent(eventId),
          organizerApi.getSeatCategoriesByEvent(eventId),
          organizerApi.getTicketsByEvent(eventId),
        ]);
        setEvent(eventRes.data.data);
        setVenue(venueRes.data.data);
        setSeatCategories(scRes.data.data);
        setTickets(ticketRes.data.data);
      } catch {
        setError("Failed to load publish prerequisites");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [eventId]);

  async function publish() {
    setPublishing(true); setError("");
    try {
      await organizerApi.publishEvent(eventId);
      navigate(`/organizer/events`);
    } catch (err) {
      setError(err?.response?.data?.message || "Publish failed. Please complete all steps.");
    } finally {
      setPublishing(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-slate-700/50 border-t-emerald-500 rounded-full mx-auto mb-3 animate-spin"></div>
        <p className="text-slate-300 font-bold text-sm">Finalizing Event...</p>
        <p className="text-slate-400 text-xs mt-1">Checking venue, categories & tickets</p>
      </div>
    </div>
  );

  const canPublish = venue && seatCategories.length > 0 && tickets.length > 0 && event?.status === "DRAFT";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 text-white p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xl border-2 border-emerald-400/30">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent tracking-tight mb-1">
            Ready to Publish?
          </h1>
          <p className="text-sm text-slate-400">Review your event setup and launch to the world</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">

          {error && (
            <div className="bg-rose-500/10 border-t border-rose-500/30 p-4">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-base font-black text-rose-100">Publish Failed</p>
                  <p className="text-rose-300 font-medium text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Checklist */}
          <div className="p-5">
            <h2 className="text-base font-black text-slate-100 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Event Checklist
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Event */}
              <div className="bg-slate-800/70 rounded-xl p-4 border border-slate-700/50 hover:border-emerald-500/40 transition-all">
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${event ? 'bg-emerald-400' : 'bg-slate-500/50'}`} />
                  <h3 className="font-black text-sm text-slate-100 truncate">{event?.title || "Event Name"}</h3>
                </div>
                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${event?.status === 'DRAFT' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-500/20 text-slate-400 border border-slate-500/40'}`}>
                  {event?.status || "Unknown"}
                </span>
                <p className={`text-xs mt-2 ${event ? 'text-emerald-300' : 'text-slate-500'}`}>
                  {event ? 'Event details complete' : 'Event not found'}
                </p>
              </div>

              {/* Venue */}
              <div className="bg-slate-800/70 rounded-xl p-4 border border-slate-700/50 hover:border-emerald-500/40 transition-all">
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${venue ? 'bg-emerald-400' : 'bg-rose-500/50'}`} />
                  <h3 className="font-black text-sm text-slate-100 truncate">{venue?.name || "No Venue"}</h3>
                </div>
                <p className="text-base font-black text-slate-400">{venue?.layoutType || '—'}</p>
                <p className={`text-xs mt-1 ${venue ? 'text-emerald-300' : 'text-rose-400'}`}>
                  {venue ? 'Venue configured' : 'Venue required'}
                </p>
              </div>

              {/* Categories & Tickets */}
              <div className="bg-slate-800/70 rounded-xl p-4 border border-slate-700/50 hover:border-emerald-500/40 transition-all">
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${(seatCategories.length > 0 && tickets.length > 0) ? 'bg-emerald-400' : 'bg-rose-500/50'}`} />
                  <h3 className="font-black text-sm text-slate-100">
                    {seatCategories.length} Cat • {tickets.length} Tickets
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1 mb-1">
                  {seatCategories.slice(0, 2).map(cat => (
                    <span key={cat.id} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full font-bold border border-purple-500/30">{cat.name}</span>
                  ))}
                  {seatCategories.length > 2 && <span className="px-2 py-0.5 bg-slate-500/20 text-slate-400 text-xs rounded-full font-bold">+{seatCategories.length - 2}</span>}
                </div>
                <p className={`text-xs ${(seatCategories.length > 0 && tickets.length > 0) ? 'text-emerald-300' : 'text-rose-400'}`}>
                  {(seatCategories.length > 0 && tickets.length > 0) ? 'Pricing ready' : 'Categories & tickets required'}
                </p>
              </div>
            </div>
          </div>

          {/* Warnings */}
          {!canPublish && (
            <div className="bg-amber-500/10 border-t border-amber-500/30 p-5">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-amber-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-black text-amber-100 mb-2">Complete these steps first:</h3>
                  <ul className="space-y-1.5">
                    {!venue && <li className="text-amber-200 text-xs flex items-center"><span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-2 flex-shrink-0"></span>Create venue details</li>}
                    {seatCategories.length === 0 && <li className="text-amber-200 text-xs flex items-center"><span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-2 flex-shrink-0"></span>Add seat categories</li>}
                    {tickets.length === 0 && <li className="text-amber-200 text-xs flex items-center"><span className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-2 flex-shrink-0"></span>Create ticket types</li>}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="bg-slate-800/30 border-t border-slate-700/50 p-5">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate(`/organizer/events`)}
                disabled={publishing}
                className="flex-1 px-5 py-2.5 bg-slate-800/80 border-2 border-slate-700/50 text-slate-300 font-bold rounded-xl hover:bg-slate-700/80 hover:text-slate-200 transition-all text-sm flex items-center justify-center disabled:opacity-50"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Events
              </button>
              <button
                onClick={publish}
                disabled={!canPublish || publishing}
                className={`flex-1 px-5 py-3 font-black text-base rounded-xl shadow-xl transition-all duration-300 ${
                  canPublish
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-emerald-500/40 hover:shadow-emerald-500/50 hover:-translate-y-0.5"
                    : "bg-slate-700/50 border-2 border-slate-600/50 text-slate-500 cursor-not-allowed"
                }`}
              >
                {publishing ? (
                  <span className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Publishing...
                  </span>
                ) : canPublish ? '🚀 Launch Event' : 'Complete Setup First'}
              </button>
            </div>

            {canPublish && (
              <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
                <p className="text-sm font-bold text-emerald-300">✅ All systems go! Your event is ready to launch.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}