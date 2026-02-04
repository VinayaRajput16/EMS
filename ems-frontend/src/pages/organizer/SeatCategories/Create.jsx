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

  // Load venue ONLY for display
  useEffect(() => {
    organizerApi
      .getVenueByEvent(eventId)
      .then((res) => {
        setVenueName(res.data.data.name);
      })
      .catch(() => {
        setError("Venue must be created before seat categories");
      });
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

      // reset form for next category
      setName("");
      setPriority(1);
      setMaxSeats("");

      if (goNext) {
        navigate(`/organizer/events/${eventId}/tickets`);
      }
    } catch {
      setError("Failed to create seat category");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 text-white p-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-slate-100 via-purple-400 to-purple-500 bg-clip-text text-transparent tracking-tight mb-4">
            Seat Categories
          </h1>
          <p className="text-xl text-slate-400 font-medium">Step 3 of 3: Define your pricing tiers</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-gradient-to-b from-white/5 to-white/2 backdrop-blur-xl rounded-4xl border border-slate-700/50 shadow-2xl overflow-hidden">
          
          {/* Venue Header */}
          <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-b border-slate-700/50 p-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-100">Venue</h2>
                <p className="text-slate-400 font-medium">{venueName || "Loading..."}</p>
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-rose-500/10 border-rose-500/30 border-t p-6 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-rose-300 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(false);
            }}
            className="p-8 space-y-8"
          >
            
            {/* Category Name */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center">
                <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Category Name
              </label>
              <input
                className="w-full px-6 py-5 bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-md border-2 border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-500 focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500/70 transition-all duration-300 font-semibold focus:outline-none hover:border-slate-600/70 shadow-lg hover:shadow-purple-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                placeholder="VIP, Gold, Silver, General..."
              />
            </div>

            {/* Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center">
                  <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  </svg>
                  Priority (Lower = Better)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  className="w-full px-6 py-5 bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-md border-2 border-emerald-500/30 rounded-2xl text-slate-100 focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500/70 transition-all duration-300 font-mono text-xl font-bold text-center hover:shadow-emerald-500/20 shadow-lg disabled:opacity-60"
                  value={priority}
                  onChange={(e) => setPriority(Math.max(1, parseInt(e.target.value) || 1))}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center">
                  <svg className="w-4 h-4 mr-2 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Max Seats (Optional)
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="Unlimited"
                  className="w-full px-6 py-5 bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-md border-2 border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-500 focus:ring-4 focus:ring-rose-500/30 focus:border-rose-500/70 transition-all duration-300 font-mono text-xl font-bold text-center hover:shadow-rose-500/20 shadow-lg disabled:opacity-60"
                  value={maxSeats}
                  onChange={(e) => setMaxSeats(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-800/50">
              <button
                type="button"
                onClick={() => navigate(`/organizer/events/${eventId}`)}
                disabled={loading}
                className="flex-1 group relative px-10 py-6 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-md border-2 border-slate-700/50 text-slate-300 font-bold rounded-3xl hover:from-slate-700/80 hover:to-slate-800/80 hover:border-slate-600/70 hover:text-slate-200 transition-all duration-300 hover:shadow-xl hover:shadow-slate-500/30 hover:-translate-y-1 text-lg shadow-lg"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-slate-400/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center justify-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Cancel
                </span>
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 group relative px-10 py-6 bg-gradient-to-r from-emerald-600/90 to-emerald-700/90 backdrop-blur-md text-white font-black rounded-3xl hover:from-emerald-700/95 hover:to-emerald-800/95 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/40 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 text-lg overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/40 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center justify-center">
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 mr-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className="flex-1 group relative px-10 py-6 bg-gradient-to-r from-purple-600/90 to-purple-700/90 backdrop-blur-md text-white font-black rounded-3xl hover:from-purple-700/95 hover:to-purple-800/95 transition-all duration-300 shadow-2xl hover:shadow-purple-500/40 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-purple-500/50 text-lg overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-400/40 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center justify-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
