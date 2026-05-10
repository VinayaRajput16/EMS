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
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => { loadCategories(); }, [eventId]);

  async function loadCategories() {
    try {
      const res = await organizerApi.getSeatCategoriesByEvent(eventId);
      setCategories(res.data.data);
    } catch {
      setError("Failed to load seat categories");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(categoryId, categoryName) {
    if (!confirm(`Are you sure you want to delete "${categoryName}"? This will delete all associated seats.`)) return;
    setDeletingId(categoryId);
    try {
      await organizerApi.deleteSeatCategory(categoryId);
      await loadCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete seat category");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-slate-700/50 border-t-purple-500 rounded-full mx-auto mb-3 animate-spin"></div>
        <p className="text-slate-400 font-semibold text-sm">Loading seat categories...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 text-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-slate-100 via-purple-400 to-purple-500 bg-clip-text text-transparent tracking-tight mb-1">
              Seat Categories
            </h1>
            <p className="text-sm text-slate-400">Manage pricing tiers for your event</p>
          </div>
          <button
            onClick={() => navigate(`/organizer/events/${eventId}/seat-categories/create`)}
            className="group px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-purple-500/40 hover:-translate-y-0.5 text-sm whitespace-nowrap self-start"
          >
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Category
            </span>
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 p-4">
              <p className="text-rose-300 font-medium text-sm">{error}</p>
            </div>
          )}

          {categories.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-700/50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-black text-slate-300 mb-2">No Categories Yet</h3>
              <p className="text-sm text-slate-500 mb-6 max-w-xs mx-auto">Create your first seat category to get started with pricing tiers</p>
              <button
                onClick={() => navigate(`/organizer/events/${eventId}/seat-categories/create`)}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-purple-500/40 text-sm"
              >
                Create First Category
              </button>
            </div>
          ) : (
            <>
              {/* Stats */}
              <div className="bg-slate-800/40 border-b border-slate-700/50 p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xl font-black">{categories.length}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mt-0.5">Categories</div>
                  </div>
                  <div>
                    <div className="text-xl font-black text-emerald-400">{categories.reduce((sum, c) => sum + (c.maxSeats || 0), 0)}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mt-0.5">Total Seats</div>
                  </div>
                  <div>
                    <div className="text-xl font-black text-rose-400">{categories.filter(c => !c.maxSeats).length}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mt-0.5">Unlimited</div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-800/50 border-b border-slate-700/50">
                      <th className="px-5 py-3 text-left text-slate-300 font-black uppercase tracking-wider text-xs">Category</th>
                      <th className="px-5 py-3 text-left text-slate-300 font-black uppercase tracking-wider text-xs">Priority</th>
                      <th className="px-5 py-3 text-left text-slate-300 font-black uppercase tracking-wider text-xs">Max Seats</th>
                      <th className="px-5 py-3 text-left text-slate-300 font-black uppercase tracking-wider text-xs">Status</th>
                      <th className="px-5 py-3 text-right text-slate-300 font-black uppercase tracking-wider text-xs">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {categories.sort((a, b) => a.priority - b.priority).map((category) => (
                      <tr key={category.id} className="group hover:bg-slate-800/30 transition-all duration-200">
                        <td className="px-5 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 bg-purple-500/15 rounded-xl border border-purple-500/30 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/30">
                              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                            </div>
                            <div>
                              <div className="font-black text-slate-100 text-sm">{category.name}</div>
                              <div className="text-xs text-slate-500 font-mono">ID: {category.id.slice(0, 8)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 bg-emerald-500/20 rounded-xl border border-emerald-500/40 text-emerald-400 font-bold text-xs">#{category.priority}</span>
                        </td>
                        <td className="px-5 py-4">
                          {category.maxSeats ? (
                            <span className="inline-flex px-2.5 py-1 bg-slate-500/20 rounded-xl border border-slate-500/40 text-slate-300 font-bold text-xs">{category.maxSeats.toLocaleString()}</span>
                          ) : (
                            <span className="inline-flex px-2.5 py-1 bg-rose-500/20 rounded-xl border border-rose-500/40 text-rose-400 font-bold text-xs">Unlimited</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex px-2.5 py-1 bg-emerald-500/20 rounded-xl border border-emerald-500/40 text-emerald-400 font-bold text-xs">Active</span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => handleDelete(category.id, category.name)}
                            disabled={deletingId === category.id}
                            className="inline-flex items-center px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 rounded-xl border border-rose-500/40 text-rose-400 font-bold text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {deletingId === category.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Footer Actions */}
          <div className="border-t border-slate-800/50 bg-slate-800/20 p-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={() => navigate(`/organizer/events/${eventId}/seat-categories/create`)}
                className="px-5 py-2.5 bg-slate-800/80 border border-slate-700/50 text-slate-300 font-bold rounded-xl hover:bg-slate-700/80 hover:text-slate-200 transition-all text-sm"
              >
                + Add New Category
              </button>
              <button
                onClick={() => navigate(`/organizer/events/${eventId}/tickets`)}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow hover:shadow-emerald-500/40 hover:-translate-y-0.5 text-sm"
              >
                Continue to Tickets →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}