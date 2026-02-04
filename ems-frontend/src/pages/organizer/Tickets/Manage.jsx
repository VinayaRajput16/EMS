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

  // 1️⃣ Load seat categories for this event
  useEffect(() => {
    organizerApi
      .getSeatCategoriesByEvent(eventId)
      .then((res) => {
        setSeatCategories(res.data.data || []);
      })
      .catch((err) => {
        console.error("Failed to load seat categories:", err);
        setSeatCategories([]);
      });
  }, [eventId]);

  // 2️⃣ Load tickets for this event
  useEffect(() => {
    loadTickets();
  }, [eventId]);

  function loadTickets() {
    organizerApi
      .getTicketsByEvent(eventId)
      .then((res) => {
        setTickets(res.data.data || []);
      })
      .catch((err) => {
        console.error("Failed to load tickets:", err);
        setTickets([]);
      });
  }

  function toggleCategory(id) {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  async function createTicket(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await organizerApi.createTicket(eventId, {
        name,
        price: Number(price),
        seatCategoryIds: selectedCategories, // ✅ optional array
      });

      // ✅ Reset form
      setName("");
      setPrice("");
      setSelectedCategories([]);

      // ✅ Reload tickets
      loadTickets();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ticket");
      console.error("Create ticket error:", err);
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
      console.error("Delete ticket error:", err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1 5h9l-1-5" />
            </svg>
          </div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent tracking-tight mb-4">
            Ticket Management
          </h1>
          <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">
            Final step: Set pricing and seat category mappings
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* CREATE TICKET FORM */}
          <div className="bg-white/5 backdrop-blur-xl rounded-4xl border border-slate-700/50 shadow-2xl p-8 lg:sticky lg:top-8 lg:h-screen lg:overflow-y-auto">
            <h2 className="text-2xl font-black text-slate-100 mb-8 flex items-center">
              <svg className="w-8 h-8 mr-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Ticket
            </h2>

            {/* Error Alert */}
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/40 rounded-3xl p-6 mb-8 backdrop-blur-sm flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="text-rose-300 font-medium">{error}</span>
                </div>
                <button
                  onClick={() => setError("")}
                  className="text-rose-400 hover:text-rose-300 font-bold text-xl ml-4"
                >
                  ×
                </button>
              </div>
            )}

            <form onSubmit={createTicket} className="space-y-8">
              
              {/* Ticket Name */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center">
                  <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1 5h9l-1-5" />
                  </svg>
                  Ticket Name
                </label>
                <input
                  className="w-full px-6 py-5 bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-md border-2 border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-500 focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500/70 transition-all duration-300 font-semibold shadow-lg hover:shadow-emerald-500/20 disabled:opacity-60"
                  placeholder="VIP Gold, General Admission, Student..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* Price */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center">
                  <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  Price (₹)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-2xl font-black text-emerald-400">₹</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full pl-14 pr-6 py-5 bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-md border-2 border-emerald-500/30 rounded-2xl text-slate-100 placeholder-slate-500 focus:ring-4 focus:ring-emerald-500/40 focus:border-emerald-500/70 transition-all duration-300 font-mono text-2xl font-bold text-right shadow-xl hover:shadow-emerald-500/30 disabled:opacity-60"
                    placeholder="999.99"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Seat Category Mapping */}
              {seatCategories.length > 0 && (
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center">
                    <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Seat Categories (Optional)
                  </label>
                  <p className="text-slate-400 font-medium">Select which seat categories this ticket can access</p>
                  
                  <div className="space-y-3 max-h-48 overflow-y-auto p-2 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                    {seatCategories.map((category) => (
                      <label
                        key={category.id}
                        className="flex items-center p-4 rounded-xl cursor-pointer group hover:bg-slate-700/50 transition-all duration-200 border border-slate-700/30 hover:border-purple-500/50"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => toggleCategory(category.id)}
                          className="w-5 h-5 text-purple-600 bg-slate-800/50 border-2 border-slate-600/50 rounded focus:ring-purple-500/50 focus:ring-2 mr-4 flex-shrink-0 transition-all duration-200 group-hover:scale-105"
                          disabled={loading}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-slate-100 group-hover:text-purple-400 truncate">{category.name}</div>
                          <div className="text-sm text-slate-500 font-mono">Priority: #{category.priority}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setName("");
                    setPrice("");
                    setSelectedCategories([]);
                  }}
                  disabled={loading}
                  className="group relative px-8 py-5 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-md border-2 border-slate-700/50 text-slate-300 font-bold rounded-2xl hover:from-slate-700/80 hover:to-slate-800/80 hover:border-slate-600/70 hover:text-slate-200 transition-all duration-300 shadow-lg hover:shadow-slate-500/30 hover:-translate-y-1 disabled:opacity-50"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-slate-400/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear
                  </span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative px-8 py-5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-black rounded-2xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/50 hover:-translate-y-1 disabled:opacity-50 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/40 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative flex items-center justify-center">
                    {loading ? (
                      <>
                        <svg className="w-5 h-5 mr-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Creating...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Add Ticket
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>

          {/* EXISTING TICKETS */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black text-slate-100 mb-8 flex items-center">
                <svg className="w-8 h-8 mr-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Existing Tickets ({tickets.length})
              </h2>

              {tickets.length === 0 ? (
                <div className="bg-white/5 backdrop-blur-xl rounded-4xl border border-slate-700/50 p-16 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border-2 border-dashed border-slate-700/50 flex items-center justify-center mx-auto mb-8">
                    <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1 5h9l-1-5" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black text-slate-300 mb-4">No Tickets Yet</h3>
                  <p className="text-xl text-slate-500 mb-8 max-w-md mx-auto">
                    Create your first ticket above to complete event setup
                  </p>
                </div>
              ) : (
                <div className="bg-white/5 backdrop-blur-xl rounded-4xl border border-slate-700/50 space-y-4 overflow-hidden">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="group bg-gradient-to-r from-slate-800/70 to-slate-900/70 hover:from-slate-700/80 hover:to-slate-800/80 border border-slate-700/50 p-8 rounded-3xl hover:shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-2 transition-all duration-300 hover:border-emerald-500/50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl flex-shrink-0">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1 5h9l-1-5" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-2xl font-black text-slate-100 group-hover:text-emerald-400">{ticket.name}</h3>
                              <div className="text-3xl font-black text-emerald-400 mt-1">₹{ticket.price.toLocaleString()}</div>
                              <div className="text-sm text-slate-500 font-mono">ID: {ticket.id}</div>
                            </div>
                          </div>

                          {/* Seat Category Mappings */}
                          {ticket.mappings && ticket.mappings.length > 0 && (
                            <div className="mb-6">
                              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Valid Categories</p>
                              <div className="flex flex-wrap gap-2">
                                {ticket.mappings.map((mapping) => (
                                  <span
                                    key={mapping.id}
                                    className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/40 rounded-2xl text-purple-300 font-bold text-sm shadow-purple-500/20"
                                  >
                                    {mapping.seatCategory.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => deleteTicket(ticket.id)}
                          className="group/delete ml-6 px-6 py-3 bg-gradient-to-r from-rose-500/90 to-rose-600/90 border border-rose-500/50 text-white font-bold rounded-2xl hover:from-rose-600/95 hover:to-rose-700/95 hover:shadow-rose-500/40 hover:-translate-y-1 transition-all duration-300 shadow-xl ml-auto flex-shrink-0"
                        >
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="grid grid-cols-2 gap-6 pt-12 border-t border-slate-800/50 mt-12">
              <button
                onClick={() => navigate(`/organizer/events/${eventId}`)}
                className="group relative px-12 py-6 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-md border-2 border-slate-700/50 text-slate-300 font-bold rounded-3xl hover:from-slate-700/80 hover:to-slate-800/80 hover:border-slate-600/70 hover:text-slate-200 transition-all duration-300 shadow-xl hover:shadow-slate-500/30 hover:-translate-y-1 text-lg"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-slate-400/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center justify-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Event
                </span>
              </button>
              <button
                onClick={() => navigate(`/organizer/events/${eventId}/publish`)}
                className="group relative px-12 py-6 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-black rounded-3xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/50 hover:-translate-y-1 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/40 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Publish Event
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
