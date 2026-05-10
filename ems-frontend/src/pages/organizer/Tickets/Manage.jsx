// src/pages/organizer/Events/OrganizerTicketManage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { organizerApi } from "../../../api/organizer.api";

export default function OrganizerTicketManage() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const [seatCategories, setSeatCategories] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    organizerApi.getSeatCategoriesByEvent(eventId)
      .then((res) => setSeatCategories(res.data.data || []))
      .catch(() => setSeatCategories([]));
  }, [eventId]);

  useEffect(() => { loadTickets(); }, [eventId]);

  function loadTickets() {
    organizerApi.getTicketsByEvent(eventId)
      .then((res) => setTickets(res.data.data || []))
      .catch(() => setTickets([]));
  }

  function toggleCategory(id) {
    setSelectedCategories((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  }

  async function createTicket(e) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      await organizerApi.createTicket(eventId, { name, price: Number(price), seatCategoryIds: selectedCategories });
      setName(""); setPrice(""); setSelectedCategories([]);
      loadTickets();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  }

  async function deleteTicket(ticketId) {
    if (!confirm("Are you sure you want to delete this ticket?")) return;
    try {
      await organizerApi.deleteTicket(ticketId);
      loadTickets();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete ticket");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 text-white p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1 5h9l-1-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent tracking-tight mb-1">
            Ticket Management
          </h1>
          <p className="text-sm text-slate-400">Final step: Set pricing and seat category mappings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* CREATE FORM */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl p-5 lg:sticky lg:top-5 lg:self-start">
            <h2 className="text-base font-black text-slate-100 mb-5 flex items-center">
              <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Ticket
            </h2>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/40 rounded-xl p-3 mb-4 flex items-center justify-between">
                <span className="text-rose-300 font-medium text-sm">{error}</span>
                <button onClick={() => setError("")} className="text-rose-400 hover:text-rose-300 font-bold ml-3">×</button>
              </div>
            )}

            <form onSubmit={createTicket} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Ticket Name</label>
                <input
                  className="w-full px-4 py-2.5 bg-slate-800/90 border-2 border-slate-700/50 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/60 transition-all text-sm font-semibold outline-none"
                  placeholder="VIP Gold, General Admission..."
                  value={name} onChange={(e) => setName(e.target.value)}
                  required disabled={loading}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Price (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-lg font-black text-emerald-400">₹</span>
                  </div>
                  <input
                    type="number" min="0" step="0.01"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-800/90 border-2 border-emerald-500/30 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/60 transition-all font-mono text-lg font-bold text-right outline-none"
                    placeholder="999.99"
                    value={price} onChange={(e) => setPrice(e.target.value)}
                    required disabled={loading}
                  />
                </div>
              </div>

              {seatCategories.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Seat Categories (Optional)</label>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto p-2 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    {seatCategories.map((category) => (
                      <label key={category.id} className="flex items-center p-2.5 rounded-lg cursor-pointer hover:bg-slate-700/50 transition-all border border-slate-700/30 hover:border-purple-500/40">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => toggleCategory(category.id)}
                          className="w-4 h-4 text-purple-600 bg-slate-800/50 border-2 border-slate-600/50 rounded mr-3 flex-shrink-0"
                          disabled={loading}
                        />
                        <div>
                          <div className="font-bold text-slate-100 text-sm hover:text-purple-400">{category.name}</div>
                          <div className="text-xs text-slate-500 font-mono">Priority: #{category.priority}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setName(""); setPrice(""); setSelectedCategories([]); }}
                  disabled={loading}
                  className="px-4 py-2.5 bg-slate-800/80 border-2 border-slate-700/50 text-slate-300 font-bold rounded-xl hover:bg-slate-700/80 hover:text-slate-200 transition-all text-sm disabled:opacity-50"
                >Clear</button>
                <button
                  type="submit" disabled={loading}
                  className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-black rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow hover:shadow-emerald-500/40 hover:-translate-y-0.5 disabled:opacity-50 text-sm"
                >
                  {loading ? 'Creating...' : '+ Add Ticket'}
                </button>
              </div>
            </form>
          </div>

          {/* EXISTING TICKETS */}
          <div className="space-y-4">
            <h2 className="text-base font-black text-slate-100 flex items-center">
              <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Existing Tickets ({tickets.length})
            </h2>

            {tickets.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-10 text-center">
                <div className="w-14 h-14 bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-700/50 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1 5h9l-1-5" />
                  </svg>
                </div>
                <h3 className="text-base font-black text-slate-300 mb-2">No Tickets Yet</h3>
                <p className="text-sm text-slate-500">Create your first ticket above to complete event setup</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="group bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/50 p-4 rounded-2xl hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-0.5 transition-all duration-300 hover:border-emerald-500/40"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-emerald-500/30">
                          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1 5h9l-1-5" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-slate-100 group-hover:text-emerald-400">{ticket.name}</h3>
                          <div className="text-lg font-black text-emerald-400">₹{ticket.price.toLocaleString()}</div>
                          {ticket.mappings?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {ticket.mappings.map((mapping) => (
                                <span key={mapping.id} className="px-2.5 py-0.5 bg-purple-500/20 border border-purple-500/40 rounded-lg text-purple-300 font-bold text-xs">
                                  {mapping.seatCategory.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteTicket(ticket.id)}
                        className="ml-4 px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-400 font-bold rounded-xl text-xs transition-all hover:-translate-y-0.5 shadow"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Navigation */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800/50">
              <button
                onClick={() => navigate(`/organizer/events/${eventId}`)}
                className="px-4 py-2.5 bg-slate-800/80 border-2 border-slate-700/50 text-slate-300 font-bold rounded-xl hover:bg-slate-700/80 hover:text-slate-200 transition-all text-sm flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Event
              </button>
              <button
                onClick={() => navigate(`/organizer/events/${eventId}/publish`)}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow hover:shadow-emerald-500/40 hover:-translate-y-0.5 text-sm"
              >
                Publish Event →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}