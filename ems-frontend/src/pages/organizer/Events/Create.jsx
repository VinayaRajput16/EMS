// src/pages/organizer/OrganizerEventCreate.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { organizerApi } from "../../../api/organizer.api";

export default function OrganizerEventCreate() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [allocationMode, setAllocationMode] = useState("MANUAL");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await organizerApi.createEvent({
        title,
        description,
        startDateTime,
        endDateTime,
        allocationMode,
      });

      const eventId = res.data.data.id;
      navigate(`/organizer/events/${eventId}/venue/create`);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent tracking-tight mb-4">
            Create New Event
          </h1>
          <p className="text-xl text-slate-400 font-medium">Step 1 of 2: Event Details</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-4xl border border-slate-700/50 shadow-2xl overflow-hidden">
          
          {/* Error Alert */}
          {error && (
            <div className="bg-rose-500/10 border-rose-500/30 border-t border-b p-6 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-rose-300 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={submit} className="p-8 space-y-8">
            
            {/* Title Field */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center">
                <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Event Title
              </label>
              <input
                className="w-full px-5 py-4 bg-white/10 backdrop-blur-sm border border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-500 focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all duration-300 text-lg font-medium focus:outline-none hover:border-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={loading}
                placeholder="Enter event title..."
              />
            </div>

            {/* Description Field */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center">
                <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 10v2a2 2 0 01-2 2H9a2 2 0 00-2 2v2a2 2 0 002 2h10a2 2 0 002-2z" />
                </svg>
                Description
              </label>
              <textarea
                className="w-full px-5 py-4 bg-white/10 backdrop-blur-sm border border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-500 resize-vertical focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all duration-300 text-base font-medium focus:outline-none hover:border-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[120px]"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                placeholder="Describe your event..."
              />
            </div>

            {/* Date Time Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Start Date */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center">
                  <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-5 py-4 bg-white/10 backdrop-blur-sm border border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-500 focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all duration-300 text-lg font-medium focus:outline-none hover:border-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  value={startDateTime}
                  onChange={(e) => setStartDateTime(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* End Date */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center">
                  <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-5 py-4 bg-white/10 backdrop-blur-sm border border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-500 focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all duration-300 text-lg font-medium focus:outline-none hover:border-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  value={endDateTime}
                  onChange={(e) => setEndDateTime(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Allocation Mode */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center">
                <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Seating Allocation Mode
              </label>
              <select
                className="w-full px-5 py-4 bg-white/10 backdrop-blur-sm border border-slate-700/50 rounded-2xl text-slate-100 focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all duration-300 text-lg font-medium focus:outline-none hover:border-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed appearance-none bg-no-repeat bg-right"
                value={allocationMode}
                onChange={(e) => setAllocationMode(e.target.value)}
                disabled={loading}
              >
                <option value="MANUAL">Manual Allocation (Recommended)</option>
                <option value="AUTOMATED">Automated Allocation</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/organizer/events")}
                disabled={loading}
                className="flex-1 px-8 py-5 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-slate-300 font-bold rounded-3xl hover:bg-slate-700/50 hover:border-slate-600/50 hover:text-slate-200 transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-slate-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 group relative px-8 py-5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold rounded-3xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/50 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 -z-10" />
                <span className="relative flex items-center justify-center">
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Creating Event...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                      Next: Venue Setup
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
