// src/pages/organizer/Events/OrganizerVenueCreate.jsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { organizerApi } from "../../../api/organizer.api";
import Dropdown from "../../../components/Dropdown.jsx";

const LAYOUT_TYPES = {
  GALLERY: "GALLERY",
  ROW_COLUMN: "ROW_COLUMN",
  ROUND_TABLE: "ROUND_TABLE",
  OPEN_CROWD: "OPEN_CROWD",
};

export default function OrganizerVenueCreate() {
  const navigate = useNavigate();
  const { id: eventId } = useParams();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [layoutType, setLayoutType] = useState(LAYOUT_TYPES.ROW_COLUMN);
  const [rows, setRows] = useState(10);
  const [columns, setColumns] = useState(20);
  const [tables, setTables] = useState(10);
  const [seatsPerTable, setSeatsPerTable] = useState(8);
  const [capacity, setCapacity] = useState(200);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getTotalCapacity = () => {
    switch (layoutType) {
      case LAYOUT_TYPES.ROW_COLUMN:
      case LAYOUT_TYPES.GALLERY: return rows * columns;
      case LAYOUT_TYPES.ROUND_TABLE: return tables * seatsPerTable;
      case LAYOUT_TYPES.OPEN_CROWD: return capacity;
      default: return 0;
    }
  };

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setError("");
    let layoutConfig;
    switch (layoutType) {
      case LAYOUT_TYPES.ROW_COLUMN:
      case LAYOUT_TYPES.GALLERY: layoutConfig = { rows: Number(rows), columns: Number(columns) }; break;
      case LAYOUT_TYPES.ROUND_TABLE: layoutConfig = { tables: Number(tables), seatsPerTable: Number(seatsPerTable) }; break;
      case LAYOUT_TYPES.OPEN_CROWD: layoutConfig = { capacity: Number(capacity) }; break;
      default: setError("Invalid layout type"); setLoading(false); return;
    }
    try {
      await organizerApi.createVenueForEvent(eventId, { name, location, layoutType, layoutConfig });
      navigate(`/organizer/events/${eventId}/seat-categories/create`);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Failed to create venue");
    } finally {
      setLoading(false);
    }
  }

  const layoutOptions = [
    { value: LAYOUT_TYPES.ROW_COLUMN, label: "Row / Column (Theater)", icon: "🎭" },
    { value: LAYOUT_TYPES.GALLERY, label: "Gallery Style", icon: "🖼️" },
    { value: LAYOUT_TYPES.ROUND_TABLE, label: "Round Tables (Banquet)", icon: "🪑" },
    { value: LAYOUT_TYPES.OPEN_CROWD, label: "Open Crowd (Standing)", icon: "👥" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 text-white p-4 md:p-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent tracking-tight mb-1">
            Venue Setup
          </h1>
          <p className="text-sm text-slate-400">Step 2 of 3: Configure your venue layout</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">

          {error && (
            <div className="bg-rose-500/10 border-rose-500/30 border-t p-4">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-rose-300 font-medium text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={submit} className="p-5 space-y-5">

            {/* Basic Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Venue Name</label>
                <input
                  className="w-full px-4 py-2.5 bg-white/10 border border-slate-700/50 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all text-sm font-medium outline-none"
                  value={name} onChange={(e) => setName(e.target.value)}
                  required disabled={loading} placeholder="e.g., Grand Hall A"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Location</label>
                <input
                  className="w-full px-4 py-2.5 bg-white/10 border border-slate-700/50 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all text-sm font-medium outline-none"
                  value={location} onChange={(e) => setLocation(e.target.value)}
                  required disabled={loading} placeholder="e.g., 123 Main St, City"
                />
              </div>
            </div>

            {/* Layout Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Layout Type</label>
              <Dropdown
                options={layoutOptions} value={layoutType}
                onChange={(value) => setLayoutType(value)}
                disabled={loading} placeholder="Select layout type" className="w-full"
              />
            </div>

            {/* Layout Configs */}
            {(layoutType === LAYOUT_TYPES.ROW_COLUMN || layoutType === LAYOUT_TYPES.GALLERY) && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                {[{ label: "Rows", value: rows, set: setRows, max: 100 }, { label: "Columns", value: columns, set: setColumns, max: 100 }].map(f => (
                  <div key={f.label} className="space-y-1.5">
                    <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{f.label}</label>
                    <input type="number" min="1" max={f.max}
                      className="w-full px-4 py-2.5 bg-white/20 border border-emerald-500/30 rounded-xl text-slate-100 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-mono text-base outline-none"
                      value={f.value} onChange={(e) => f.set(Math.max(1, parseInt(e.target.value) || 1))}
                    />
                  </div>
                ))}
              </div>
            )}

            {layoutType === LAYOUT_TYPES.ROUND_TABLE && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                {[{ label: "Tables", value: tables, set: setTables, max: 50, color: "purple" }, { label: "Seats/Table", value: seatsPerTable, set: setSeatsPerTable, max: 20, color: "purple" }].map(f => (
                  <div key={f.label} className="space-y-1.5">
                    <label className="text-xs font-bold text-purple-400 uppercase tracking-wider">{f.label}</label>
                    <input type="number" min="1" max={f.max}
                      className="w-full px-4 py-2.5 bg-white/20 border border-purple-500/30 rounded-xl text-slate-100 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-mono text-base outline-none"
                      value={f.value} onChange={(e) => f.set(Math.max(1, parseInt(e.target.value) || 1))}
                    />
                  </div>
                ))}
              </div>
            )}

            {layoutType === LAYOUT_TYPES.OPEN_CROWD && (
              <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <label className="text-xs font-bold text-rose-400 uppercase tracking-wider block mb-2">Total Capacity</label>
                <input type="number" min="1" max="5000"
                  className="w-full max-w-xs px-4 py-2.5 bg-white/20 border border-rose-500/30 rounded-xl text-slate-100 focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all font-mono text-xl font-bold text-center outline-none"
                  value={capacity} onChange={(e) => setCapacity(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>
            )}

            {/* Live Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-100">Live Preview</h3>
                <div className="text-base font-black text-emerald-400">{getTotalCapacity()} seats</div>
              </div>
              <div className="p-5 bg-slate-800/50 rounded-2xl border border-slate-700/50 min-h-40 flex items-center justify-center overflow-auto">
                {(layoutType === LAYOUT_TYPES.ROW_COLUMN || layoutType === LAYOUT_TYPES.GALLERY) && (
                  <div
                    className="inline-grid gap-0.5 p-3 bg-white/10 rounded-xl max-h-60 overflow-auto"
                    style={{ gridTemplateColumns: `repeat(${Math.min(columns, 30)}, 10px)` }}
                  >
                    {Array.from({ length: Math.min(rows * columns, 900) }).map((_, i) => (
                      <div key={i} className="w-2.5 h-2.5 bg-slate-400/50 hover:bg-emerald-400/80 rounded-sm transition-colors cursor-pointer" />
                    ))}
                  </div>
                )}
                {layoutType === LAYOUT_TYPES.ROUND_TABLE && (
                  <div className="flex flex-wrap gap-3 justify-center">
                    {Array.from({ length: Math.min(tables, 20) }).map((_, i) => (
                      <div key={i} className="w-14 h-14 bg-purple-500/50 rounded-xl flex items-center justify-center text-white font-bold text-sm border-2 border-white/20 hover:scale-105 transition-transform">
                        {seatsPerTable}
                      </div>
                    ))}
                    {tables > 20 && <div className="w-14 h-14 bg-slate-700/50 rounded-xl flex items-center justify-center text-slate-400 text-xs border-2 border-dashed border-slate-600/50">+{tables - 20}</div>}
                  </div>
                )}
                {layoutType === LAYOUT_TYPES.OPEN_CROWD && (
                  <div className="text-center">
                    <div className="w-20 h-20 bg-rose-500/20 rounded-2xl border-4 border-dashed border-rose-500/50 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-10 h-10 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="text-2xl font-black text-slate-200">{capacity}</p>
                    <p className="text-slate-400 text-sm mt-1">Standing Capacity</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button" disabled={loading}
                onClick={() => navigate(`/organizer/events/${eventId}`)}
                className="flex-1 px-5 py-2.5 bg-slate-800/50 border border-slate-700/50 text-slate-300 font-bold rounded-xl hover:bg-slate-700/50 hover:text-slate-200 transition-all text-sm disabled:opacity-50"
              >Cancel</button>
              <button
                type="submit" disabled={loading}
                className="flex-1 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg hover:shadow-emerald-500/40 hover:-translate-y-0.5 disabled:opacity-50 text-sm"
              >
                {loading ? 'Saving...' : 'Next: Seat Categories →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}