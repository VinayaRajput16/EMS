// src/pages/organizer/SeatCategories/List.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { organizerApi } from "../../../api/organizer.api";

export default function SeatCategoryList() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      try {
        const res = await organizerApi.getSeatCategoriesByEvent(eventId);
        if (mounted) {
          setCategories(res.data.data);
        }
      } catch {
        if (mounted) {
          setError("Failed to load seat categories");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadCategories();
    return () => {
      mounted = false;
    };
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 flex items-center justify-center p-8">
        <div className="bg-white/5 backdrop-blur-xl rounded-4xl p-12 border border-slate-700/50 shadow-2xl text-center max-w-md">
          <div className="w-16 h-16 border-4 border-slate-700/50 border-t-purple-500 rounded-full mx-auto mb-6 animate-spin"></div>
          <p className="text-xl text-slate-400 font-semibold">Loading seat categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-slate-100 via-purple-400 to-purple-500 bg-clip-text text-transparent tracking-tight mb-2">
              Seat Categories
            </h1>
            <p className="text-xl text-slate-400 font-medium max-w-lg">
              Manage pricing tiers for your event
            </p>
          </div>
          
          <button
            onClick={() => navigate(`/organizer/events/${eventId}/seat-categories/create`)}
            className="group relative px-10 py-5 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-black rounded-3xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 hover:-translate-y-1 whitespace-nowrap lg:self-start"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Category
            </span>
          </button>
        </div>

        {/* Main Content Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-4xl border border-slate-700/50 shadow-2xl overflow-hidden">
          
          {/* Error Alert */}
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 p-8 backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                <svg className="w-8 h-8 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h3 className="text-xl font-bold text-rose-200 mb-1">{error}</h3>
                  <p className="text-rose-300">Please try refreshing the page.</p>
                </div>
              </div>
            </div>
          )}

          {/* Categories Table */}
          {categories.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-28 h-28 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl flex items-center justify-center mx-auto mb-8 border-2 border-dashed border-slate-700/50">
                <svg className="w-14 h-14 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-slate-300 mb-4">No Categories Yet</h3>
              <p className="text-xl text-slate-500 mb-8 max-w-md mx-auto">
                Create your first seat category to get started with pricing tiers
              </p>
              <button
                onClick={() => navigate(`/organizer/events/${eventId}/seat-categories/create`)}
                className="group relative px-10 py-5 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-black rounded-3xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 hover:-translate-y-1"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create First Category
                </span>
              </button>
            </div>
          ) : (
            <>
              {/* Stats Header */}
              <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-b border-slate-700/50 p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="group hover:text-purple-400 transition-colors">
                    <div className="text-3xl font-black">{categories.length}</div>
                    <div className="text-sm text-slate-400 uppercase tracking-wider font-bold mt-1">Total Categories</div>
                  </div>
                  <div className="group hover:text-emerald-400 transition-colors">
                    <div className="text-3xl font-black">{categories.reduce((sum, c) => sum + (c.maxSeats || 0), 0)}</div>
                    <div className="text-sm text-slate-400 uppercase tracking-wider font-bold mt-1">Limited Seats</div>
                  </div>
                  <div className="group hover:text-rose-400 transition-colors">
                    <div className="text-3xl font-black">{categories.filter(c => !c.maxSeats).length}</div>
                    <div className="text-sm text-slate-400 uppercase tracking-wider font-bold mt-1">Unlimited</div>
                  </div>
                </div>
              </div>

              {/* Modern Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50">
                      <th className="px-8 py-6 text-left text-slate-300 font-black uppercase tracking-wider text-xs">
                        Category
                      </th>
                      <th className="px-8 py-6 text-left text-slate-300 font-black uppercase tracking-wider text-xs">
                        Priority
                      </th>
                      <th className="px-8 py-6 text-left text-slate-300 font-black uppercase tracking-wider text-xs">
                        Max Seats
                      </th>
                      <th className="px-8 py-6 text-right text-slate-300 font-black uppercase tracking-wider text-xs">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {categories.sort((a, b) => a.priority - b.priority).map((category) => (
                      <tr key={category.id} className="group hover:bg-slate-800/30 transition-all duration-200 hover:shadow-slate-500/20">
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl border-2 border-purple-500/30 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/40 group-hover:border-purple-500/60">
                              <svg className="w-6 h-6 text-purple-400 group-hover:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                            </div>
                            <div>
                              <div className="font-black text-slate-100 text-lg group-hover:text-purple-400 transition-colors">{category.name}</div>
                              <div className="text-sm text-slate-500 font-mono">ID: {category.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-2xl border border-emerald-500/40 text-emerald-400 font-bold text-sm shadow-emerald-500/20">
                            #{category.priority}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          {category.maxSeats ? (
                            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-slate-500/20 to-slate-600/20 rounded-2xl border border-slate-500/40 text-slate-300 font-bold text-sm shadow-slate-500/20">
                              {category.maxSeats.toLocaleString()}
                            </div>
                          ) : (
                            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-rose-500/20 to-rose-600/20 rounded-2xl border border-rose-500/40 text-rose-400 font-bold text-sm shadow-rose-500/20">
                              Unlimited
                            </span>
                          )}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className="inline-flex px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-2xl border border-emerald-500/40 text-emerald-400 font-bold text-sm shadow-emerald-500/20">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="border-t border-slate-800/50 bg-gradient-to-r from-slate-800/30 to-slate-900/30 p-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button
                onClick={() => navigate(`/organizer/events/${eventId}/seat-categories/create`)}
                className="flex-1 sm:w-auto group relative px-10 py-5 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-md border-2 border-slate-700/50 text-slate-300 font-bold rounded-3xl hover:from-slate-700/80 hover:to-slate-800/80 hover:border-slate-600/70 hover:text-slate-200 transition-all duration-300 hover:shadow-xl hover:shadow-slate-500/30 hover:-translate-y-1"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-slate-400/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center justify-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Category
                </span>
              </button>
              <button
                onClick={() => navigate(`/organizer/events/${eventId}/tickets`)}
                className="group relative px-12 py-6 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-black rounded-3xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/50 hover:-translate-y-1 whitespace-nowrap"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  Continue to Tickets
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
