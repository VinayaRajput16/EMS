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
  const [allocationModeOpen, setAllocationModeOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await organizerApi.createEvent({ title, description, startDateTime, endDateTime, allocationMode });
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 text-white p-4 sm:p-6">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent tracking-tight mb-1.5">
            Create New Event
          </h1>
          <p className="text-sm text-slate-400 font-medium">Step 1 of 2: Event Details</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">

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
          <form onSubmit={submit} className="p-5 sm:p-6 space-y-5">

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
                <svg className="w-3.5 h-3.5 mr-1.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Event Title
              </label>
              <input
                className="w-full px-4 py-2.5 bg-white/10 border border-slate-700/50 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all duration-300 text-sm font-medium focus:outline-none hover:border-slate-600/50 disabled:opacity-50"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={loading}
                placeholder="Enter event title..."
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
                <svg className="w-3.5 h-3.5 mr-1.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 10v2a2 2 0 01-2 2H9" />
                </svg>
                Description
              </label>
              <textarea
                className="w-full px-4 py-2.5 bg-white/10 border border-slate-700/50 rounded-xl text-slate-100 placeholder-slate-500 resize-vertical focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all duration-300 text-sm font-medium focus:outline-none hover:border-slate-600/50 disabled:opacity-50 min-h-[90px]"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                placeholder="Describe your event..."
              />
            </div>

            {/* Date Time Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-2.5 bg-white/10 border border-slate-700/50 rounded-xl text-slate-100 focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all duration-300 text-sm font-medium focus:outline-none hover:border-slate-600/50 disabled:opacity-50"
                  value={startDateTime}
                  onChange={(e) => setStartDateTime(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-2.5 bg-white/10 border border-slate-700/50 rounded-xl text-slate-100 focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all duration-300 text-sm font-medium focus:outline-none hover:border-slate-600/50 disabled:opacity-50"
                  value={endDateTime}
                  onChange={(e) => setEndDateTime(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Allocation Mode */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
                <svg className="w-3.5 h-3.5 mr-1.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Seating Allocation Mode
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => !loading && setAllocationModeOpen(!allocationModeOpen)}
                  disabled={loading}
                  className="w-full px-4 py-2.5 bg-white/10 border border-slate-700/50 rounded-xl text-slate-100 focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all duration-300 text-sm font-medium focus:outline-none hover:border-slate-600/50 disabled:opacity-50 flex items-center justify-between"
                >
                  <span>{allocationMode === 'MANUAL' ? 'Manual Allocation (Recommended)' : 'Automated Allocation'}</span>
                  <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${allocationModeOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {allocationModeOpen && (
                  <div className="absolute z-50 w-full mt-1.5 bg-slate-800/95 border border-slate-700/50 rounded-xl overflow-hidden shadow-xl">
                    {[
                      { value: 'MANUAL', label: 'Manual Allocation (Recommended)' },
                      { value: 'AUTOMATED', label: 'Automated Allocation' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => { setAllocationMode(option.value); setAllocationModeOpen(false); }}
                        className={`w-full px-4 py-3 text-left text-sm font-medium transition-all duration-150 flex items-center justify-between ${
                          allocationMode === option.value
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'text-slate-200 hover:bg-white/10'
                        }`}
                      >
                        <span>{option.label}</span>
                        {allocationMode === option.value && (
                          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/organizer/events")}
                disabled={loading}
                className="flex-1 px-5 py-2.5 bg-slate-800/50 border border-slate-700/50 text-slate-300 text-sm font-bold rounded-xl hover:bg-slate-700/50 hover:text-slate-200 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-500/30 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 group relative px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-sm font-bold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-emerald-500/40 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 disabled:opacity-50 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center justify-center">
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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