// src/pages/organizer/Events/SeatCategoryCreate.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { organizerApi } from "../../../api/organizer.api";

export default function SeatCategoryCreate() {
  const navigate = useNavigate();
  const { id: eventId } = useParams();

  const [venueName, setVenueName] = useState("");
  const [name, setName] = useState("");
  const [priority, setPriority] = useState(1);
  const [maxSeats, setMaxSeats] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    organizerApi.getVenueByEvent(eventId)
      .then((res) => setVenueName(res.data.data.name))
      .catch(() => setError("Venue must be created before seat categories"));
  }, [eventId]);

  async function submit(goNext) {
    setLoading(true);
    setError("");
    try {
      await organizerApi.createSeatCategoryForEvent(eventId, {
        name,
        priority: Number(priority),
        maxSeats: maxSeats ? Number(maxSeats) : null,
      });
      setName("");
      setPriority(1);
      setMaxSeats("");
      if (goNext) navigate(`/organizer/events/${eventId}/tickets`);
    } catch {
      setError("Failed to create seat category");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 text-white p-4 sm:p-6">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-slate-100 via-purple-400 to-purple-500 bg-clip-text text-transparent tracking-tight mb-1.5">
            Seat Categories
          </h1>
          <p className="text-sm text-slate-400 font-medium">Step 3 of 3: Define your pricing tiers</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">

          {/* Venue Header */}
          <div className="bg-slate-800/50 border-b border-slate-700/50 px-5 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-100">Venue</h2>
                <p className="text-slate-400 text-xs font-medium">{venueName || "Loading..."}</p>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-rose-500/10 border-b border-rose-500/30 px-5 py-3">
              <div className="flex items-center space-x-3">
                <svg className="w-4 h-4 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-rose-300 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={(e) => { e.preventDefault(); submit(false); }} className="p-5 sm:p-6 space-y-5">

            {/* Category Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
                <svg className="w-3.5 h-3.5 mr-1.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Category Name
              </label>
              <input
                className="w-full px-4 py-2.5 bg-slate-800/95 border-2 border-slate-700/50 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500/70 transition-all duration-300 text-sm font-medium focus:outline-none hover:border-slate-600/70 disabled:opacity-60"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                placeholder="VIP, Gold, Silver, General..."
              />
            </div>

            {/* Priority & Max Seats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  </svg>
                  Priority
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  className="w-full px-4 py-2.5 bg-slate-800/95 border-2 border-emerald-500/30 rounded-xl text-slate-100 focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500/70 transition-all duration-300 font-mono text-base font-bold text-center shadow-sm disabled:opacity-60 focus:outline-none"
                  value={priority}
                  onChange={(e) => setPriority(Math.max(1, parseInt(e.target.value) || 1))}
                  required
                  disabled={loading}
                />
                <p className="text-xs text-slate-500">Lower = better</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1.5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Max Seats
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="Unlimited"
                  className="w-full px-4 py-2.5 bg-slate-800/95 border-2 border-slate-700/50 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-4 focus:ring-rose-500/30 focus:border-rose-500/70 transition-all duration-300 font-mono text-base font-bold text-center shadow-sm disabled:opacity-60 focus:outline-none"
                  value={maxSeats}
                  onChange={(e) => setMaxSeats(e.target.value)}
                  disabled={loading}
                />
                <p className="text-xs text-slate-500">Optional</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-800/50">
              <button
                type="button"
                onClick={() => navigate(`/organizer/events/${eventId}`)}
                disabled={loading}
                className="flex-1 group relative px-5 py-2.5 bg-slate-800/80 border-2 border-slate-700/50 text-slate-300 text-sm font-bold rounded-xl hover:bg-slate-700/80 hover:border-slate-600/70 hover:text-slate-200 transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Cancel
                </span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 group relative px-5 py-2.5 bg-gradient-to-r from-emerald-600/90 to-emerald-700/90 text-white text-sm font-bold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/40 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center justify-center">
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save & Add Another
                    </>
                  )}
                </span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => submit(true)}
                className="flex-1 group relative px-5 py-2.5 bg-gradient-to-r from-purple-600/90 to-purple-700/90 text-white text-sm font-bold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-purple-500/50 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-400/40 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  Save & Finish
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}