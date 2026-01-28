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
      {/* Page Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-16 gap-8">
          <div className="min-w-0">
            <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent mb-4 drop-shadow-2xl">
              Your Events
            </h1>
            <p className="text-xl text-slate-400 font-medium tracking-tight">
              Manage your events ({loading ? '...' : events.length})
            </p>
          </div>
          
          <Link
            to="create"
            className="group relative px-8 py-5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-xl font-bold text-white rounded-2xl shadow-2xl hover:shadow-emerald-500/50 hover:-translate-y-1 transition-all duration-500 overflow-hidden border border-emerald-700/50 whitespace-nowrap flex-shrink-0"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></span>
            <span className="relative flex items-center">
              <svg className="w-6 h-6 mr-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Event
            </span>
          </Link>
        </div>

        {/* Events Container */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden">
          
          {/* Header Bar */}
          <div className="px-8 py-8 border-b border-slate-800/50 bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-100 tracking-tight">Event Management</h2>
                <p className="text-slate-500 text-sm mt-1 font-medium uppercase tracking-wider">Professional Control Panel</p>
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full" role="table" aria-label="Your events">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th scope="col" className="px-8 py-6 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Event Details
                  </th>
                  <th scope="col" className="px-8 py-6 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th scope="col" className="px-8 py-6 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-800/30">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center space-y-6">
                        <LoadingSpinner className="w-16 h-16 text-emerald-500" />
                        <div>
                          <p className="text-xl text-slate-400 font-medium mb-2">Loading Events...</p>
                          <p className="text-slate-600 text-sm">Fetching your event data</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : events.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center space-y-8 max-w-md mx-auto">
                        <div className="w-28 h-28 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-3xl flex items-center justify-center border-2 border-dashed border-slate-600/50 backdrop-blur-xl">
                          <svg className="w-16 h-16 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div className="text-center space-y-3">
                          <h3 className="text-2xl font-black text-slate-200 mb-2">No Events Yet</h3>
                          <p className="text-lg text-slate-500 max-w-sm leading-relaxed">
                            Start by creating your first event to unlock the full organizer dashboard experience.
                          </p>
                        </div>
                        <Link
                          to="create"
                          className="group relative px-10 py-5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-lg font-bold text-white rounded-2xl shadow-2xl hover:shadow-emerald-500/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-emerald-700/50"
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                          <span className="relative flex items-center">
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <tr key={e.id} className="group hover:bg-slate-800/30 transition-all duration-300 border-b border-slate-800/30 last:border-b-0">
                      <td className="px-8 py-8">
                        <div className="flex items-center space-x-4 group-hover:space-x-6 transition-all duration-300">
                          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/90 to-emerald-600/90 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl flex-shrink-0 group-hover:scale-105 group-hover:shadow-emerald-500/50 transition-all duration-300 border border-emerald-400/30">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-lg font-bold text-slate-100 group-hover:text-emerald-400 transition-colors duration-300 truncate pr-4">
                              {e.title}
                            </div>
                            <div className="text-sm text-slate-500 mt-2 flex items-center">
                              <span className="w-2 h-2 bg-slate-500 rounded-full mr-3"></span>
                              <span>ID: </span>
                              <span className="font-mono bg-slate-800/50 px-3 py-1 rounded-xl text-emerald-400 ml-1 text-xs font-bold tracking-wide">
                                {e.id}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-8 py-8">
                        <span className={`inline-flex px-4 py-2 rounded-xl text-sm font-bold shadow-lg border backdrop-blur-sm transition-all duration-300 group-hover:scale-105 ${
                          e.status?.toLowerCase() === 'draft' 
                            ? 'bg-rose-500/20 text-rose-300 border-rose-400/50 shadow-rose-500/25' 
                            : e.status?.toLowerCase() === 'active' 
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-emerald-500/25' 
                            : 'bg-slate-700/50 text-slate-300 border-slate-600/50 shadow-slate-500/20'
                        }`}>
                          {e.status || 'Unknown'}
                        </span>
                      </td>
                      
                      <td className="px-8 py-8 whitespace-nowrap">
                        <Link
                          to={e.id}
                          className="group/btn relative inline-flex items-center px-6 py-3 border-2 border-slate-700/50 text-sm font-bold rounded-xl text-slate-300 bg-white/5 backdrop-blur-xl hover:bg-slate-800/50 hover:border-emerald-600 hover:text-emerald-300 hover:shadow-emerald-500/30 hover:-translate-y-px transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-slate-950 shadow-lg"
                          aria-label={`View ${e.title}`}
                        >
                          <svg className="w-4 h-4 mr-2 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      <style jsx>{`
        .bg-grid-slate {
          background-image: 
            linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
}
