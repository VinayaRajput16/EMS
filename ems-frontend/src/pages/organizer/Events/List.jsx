// ems-frontend/src/pages/organizer/Events/List.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { organizerApi } from "../../../api/organizer.api";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function OrganizerEventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    organizerApi.getMyEvents().then(res => {
      setEvents(res.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent mb-1">
              Your Events
            </h1>
            <p className="text-sm text-slate-400 font-medium">
              Manage your events ({loading ? '...' : events.length})
            </p>
          </div>
          <Link
            to="create"
            className="group relative px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-sm font-bold text-white rounded-xl shadow-lg hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden border border-emerald-700/50 whitespace-nowrap flex-shrink-0 flex items-center"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            <span className="relative flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Event
            </span>
          </Link>
        </div>

        {/* Events Table Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">

          {/* Card Header */}
          <div className="px-5 py-4 border-b border-slate-800/50 bg-slate-800/30 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-black text-slate-100">Event Management</h2>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Control Panel</p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full" role="table" aria-label="Your events">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th scope="col" className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Event Details
                  </th>
                  <th scope="col" className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800/30">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center space-y-3">
                        <LoadingSpinner className="w-10 h-10 text-emerald-500" />
                        <p className="text-sm text-slate-400 font-medium">Loading Events...</p>
                      </div>
                    </td>
                  </tr>
                ) : events.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center space-y-5 max-w-sm mx-auto">
                        <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-600/50">
                          <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <h3 className="text-base font-black text-slate-200 mb-1">No Events Yet</h3>
                          <p className="text-sm text-slate-500 mb-4">Create your first event to get started.</p>
                        </div>
                        <Link
                          to="create"
                          className="group relative px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-sm font-bold text-white rounded-xl shadow-lg hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden border border-emerald-700/50"
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                          <span className="relative flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Create First Event
                          </span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  events.map((e) => (
                    <tr key={e.id} className="group hover:bg-slate-800/30 transition-all duration-300">
                      <td className="px-5 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-emerald-500/90 to-emerald-600/90 rounded-xl flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition-colors duration-300 truncate">
                              {e.title}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5 flex items-center">
                              <span className="font-mono bg-slate-800/50 px-2 py-0.5 rounded-lg text-emerald-400 text-xs font-bold tracking-wide">
                                {e.id}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold border ${
                          e.status?.toLowerCase() === 'draft'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-400/50'
                            : e.status?.toLowerCase() === 'active' || e.status?.toLowerCase() === 'published'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50'
                            : 'bg-slate-700/50 text-slate-300 border-slate-600/50'
                        }`}>
                          {e.status || 'Unknown'}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <Link
                          to={e.id}
                          className="inline-flex items-center px-3.5 py-1.5 border border-slate-700/50 text-xs font-bold rounded-lg text-slate-300 bg-white/5 hover:bg-slate-800/50 hover:border-emerald-600 hover:text-emerald-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 shadow-sm"
                          aria-label={`View ${e.title}`}
                        >
                          <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}