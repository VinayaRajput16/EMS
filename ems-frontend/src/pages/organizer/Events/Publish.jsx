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

  // Load everything needed for validation
  useEffect(() => {
    async function load() {
      try {
        const eventRes = await organizerApi.getEventById(eventId);
        setEvent(eventRes.data.data);

        const venueRes = await organizerApi.getVenueByEvent(eventId);
        setVenue(venueRes.data.data);

        const scRes = await organizerApi.getSeatCategoriesByEvent(eventId);
        setSeatCategories(scRes.data.data);

        const ticketRes = await organizerApi.getTicketsByEvent(eventId);
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
    setPublishing(true);
    setError("");

    try {
      await organizerApi.publishEvent(eventId);
      navigate(`/organizer/events`);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Publish failed. Please complete all steps."
      );
    } finally {
      setPublishing(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 flex items-center justify-center p-8">
        <div className="bg-white/5 backdrop-blur-xl rounded-4xl p-16 border border-slate-700/50 shadow-2xl text-center max-w-lg">
          <div className="w-20 h-20 border-4 border-slate-700/50 border-t-emerald-500 rounded-full mx-auto mb-8 animate-spin"></div>
          <p className="text-2xl text-slate-300 font-bold">Finalizing Event...</p>
          <p className="text-slate-400 mt-2">Checking venue, categories & tickets</p>
        </div>
      </div>
    );
  }

  const canPublish =
    venue &&
    seatCategories.length > 0 &&
    tickets.length > 0 &&
    event?.status === "DRAFT";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Hero Header */}
        <div className="text-center mb-20">
          <div className="w-28 h-28 bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 rounded-4xl flex items-center justify-center mx-auto mb-8 shadow-2xl border-4 border-emerald-400/30">
            <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent tracking-tight mb-6">
            Ready to Publish?
          </h1>
          <p className="text-xl text-slate-400 font-semibold max-w-2xl mx-auto leading-relaxed">
            Review your event setup and launch to the world
          </p>
        </div>

        {/* Main Publish Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-4xl border border-slate-700/50 shadow-2xl overflow-hidden">
          
          {/* Error Alert */}
          {error && (
            <div className="bg-rose-500/10 border-t border-rose-500/30 p-8 backdrop-blur-sm">
              <div className="flex items-center space-x-4 max-w-2xl mx-auto">
                <svg className="w-8 h-8 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h3 className="text-2xl font-black text-rose-100 mb-2">Publish Failed</h3>
                  <p className="text-rose-300 font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Event Summary */}
          <div className="p-12">
            <h2 className="text-3xl font-black text-slate-100 mb-12 flex items-center justify-center">
              <svg className="w-10 h-10 mr-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Event Checklist
            </h2>

            {/* Checklist Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              
              {/* Event Details */}
              <div className="group relative bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-md rounded-3xl p-8 border-2 border-slate-700/50 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300">
                <div className="flex items-start space-x-4 mb-6">
                  <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${event ? 'bg-emerald-400' : 'bg-slate-500/50'}`} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-xl text-slate-100 group-hover:text-emerald-400 mb-2 truncate">{event?.title || "Event Name"}</h3>
                    <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                      event?.status === 'DRAFT' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                        : 'bg-slate-500/20 text-slate-400 border border-slate-500/40'
                    }`}>
                      {event?.status || "Unknown"}
                    </div>
                  </div>
                </div>
                <p className={`text-sm ${event ? 'text-emerald-300' : 'text-slate-500'}`}>
                  {event ? 'Event details complete' : 'Event not found'}
                </p>
              </div>

              {/* Venue */}
              <div className="group relative bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-md rounded-3xl p-8 border-2 border-slate-700/50 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 hover:translate-y-[-2px]">
                <div className="flex items-start space-x-4 mb-6">
                  <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${venue ? 'bg-emerald-400' : 'bg-rose-500/50'}`} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-xl text-slate-100 group-hover:text-emerald-400 mb-2 truncate">{venue?.name || "No Venue"}</h3>
                    <div className="text-2xl font-black text-slate-400 group-hover:text-emerald-300">
                      {venue?.layoutConfig?.rows ? `${venue.layoutConfig.rows}×${venue.layoutConfig.columns}` : venue?.layoutType || '—'}
                    </div>
                  </div>
                </div>
                <p className={`text-sm font-medium ${venue ? 'text-emerald-300' : 'text-rose-400'}`}>
                  {venue ? `Capacity: ${venue.layoutConfig?.capacity || venue.layoutConfig?.tables * venue.layoutConfig?.seatsPerTable || venue.layoutConfig?.rows * venue.layoutConfig?.columns || venue.layoutConfig?.capacity || '—'}` : 'Venue required'}
                </p>
              </div>

              {/* Seat Categories & Tickets */}
              <div className="group relative bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-md rounded-3xl p-8 border-2 border-slate-700/50 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 hover:translate-y-[-2px]">
                <div className="flex items-start space-x-4 mb-6">
                  <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${(seatCategories.length > 0 && tickets.length > 0) ? 'bg-emerald-400' : 'bg-rose-500/50'}`} />
                  <div className="flex-1">
                    <h3 className="font-black text-xl text-slate-100 group-hover:text-emerald-400 mb-2">
                      {seatCategories.length} Categories • {tickets.length} Tickets
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {seatCategories.slice(0, 2).map(cat => (
                        <span key={cat.id} className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full font-bold border border-purple-500/30">
                          {cat.name}
                        </span>
                      ))}
                      {seatCategories.length > 2 && (
                        <span className="px-3 py-1 bg-slate-500/20 text-slate-400 text-xs rounded-full font-bold">
                          +{seatCategories.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className={`text-sm font-medium ${(seatCategories.length > 0 && tickets.length > 0) ? 'text-emerald-300' : 'text-rose-400'}`}>
                  {seatCategories.length > 0 && tickets.length > 0 ? 'Pricing ready' : 'Categories & tickets required'}
                </p>
              </div>
            </div>
          </div>

          {/* Validation Warnings */}
          {!canPublish && (
            <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-t border-amber-500/30 p-10 backdrop-blur-sm">
              <div className="max-w-3xl mx-auto text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-black text-amber-100 mb-4">Almost There!</h3>
                <p className="text-xl text-amber-200 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Complete these steps to make your event live:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto text-amber-100">
                  {!venue && (
                    <li className="flex items-center p-4 bg-amber-500/20 rounded-2xl border-l-4 border-amber-400">
                      <svg className="w-6 h-6 mr-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>Create venue details</span>
                    </li>
                  )}
                  {seatCategories.length === 0 && (
                    <li className="flex items-center p-4 bg-amber-500/20 rounded-2xl border-l-4 border-amber-400">
                      <svg className="w-6 h-6 mr-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span>Add seat categories</span>
                    </li>
                  )}
                  {tickets.length === 0 && (
                    <li className="flex items-center p-4 bg-amber-500/20 rounded-2xl border-l-4 border-amber-400">
                      <svg className="w-6 h-6 mr-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1 5h9l-1-5" />
                      </svg>
                      <span>Create ticket types</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Publish Actions */}
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-t border-slate-700/50 p-12">
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto">
              
              <button
                onClick={() => navigate(`/organizer/events`)}
                disabled={publishing}
                className="flex-1 group relative px-12 py-6 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-md border-2 border-slate-700/50 text-slate-300 font-bold rounded-3xl hover:from-slate-700/80 hover:to-slate-800/80 hover:border-slate-600/70 hover:text-slate-200 transition-all duration-300 shadow-xl hover:shadow-slate-500/30 hover:-translate-y-1 max-w-md disabled:opacity-50"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-slate-400/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center justify-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Events
                </span>
              </button>

              <button
                onClick={publish}
                disabled={!canPublish || publishing}
                className={`group relative flex-1 px-16 py-8 font-black text-xl rounded-3xl shadow-2xl transition-all duration-500 overflow-hidden max-w-md ${
                  canPublish
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-emerald-500/50 hover:shadow-emerald-500/60 hover:-translate-y-2 hover:scale-[1.02] active:scale-[0.98]"
                    : "bg-gradient-to-r from-slate-700/50 to-slate-800/50 border-2 border-slate-600/50 text-slate-500 cursor-not-allowed shadow-slate-500/20"
                }`}
              >
                <span className={`absolute inset-0 bg-gradient-to-r from-emerald-400/40 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ${canPublish ? '' : 'opacity-0'}`} />
                <span className="relative flex items-center justify-center">
                  {publishing ? (
                    <>
                      <svg className="w-8 h-8 mr-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Publishing Live...
                    </>
                  ) : (
                    <>
                      <svg className={`w-8 h-8 mr-4 ${canPublish ? 'text-white' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {canPublish ? '🚀 Launch Event' : 'Complete Setup First'}
                    </>
                  )}
                </span>
              </button>
            </div>
            
            {canPublish && (
              <div className="mt-8 p-6 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-3xl text-center backdrop-blur-sm">
                <svg className="w-12 h-12 text-emerald-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-lg font-bold text-emerald-300">
                  ✅ All systems go! Your event is ready for prime time.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
