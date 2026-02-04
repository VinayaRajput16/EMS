// src/pages/organizer/Events/OrganizerVenueCreate.jsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { organizerApi } from "../../../api/organizer.api";
import Dropdown from "../../../components/Dropdown.jsx"; // Your existing component

// System layout types (must match Prisma enum)
const LAYOUT_TYPES = {
  GALLERY: "GALLERY",
  ROW_COLUMN: "ROW_COLUMN", 
  ROUND_TABLE: "ROUND_TABLE",
  OPEN_CROWD: "OPEN_CROWD",
};

export default function OrganizerVenueCreate() {
  const navigate = useNavigate();
  const { id: eventId } = useParams();

  // Basic venue info
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [layoutType, setLayoutType] = useState(LAYOUT_TYPES.ROW_COLUMN);

  // Layout configs
  const [rows, setRows] = useState(10);
  const [columns, setColumns] = useState(20);
  const [tables, setTables] = useState(10);
  const [seatsPerTable, setSeatsPerTable] = useState(8);
  const [capacity, setCapacity] = useState(200);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-calculate total capacity for previews
  const getTotalCapacity = () => {
    switch (layoutType) {
      case LAYOUT_TYPES.ROW_COLUMN:
      case LAYOUT_TYPES.GALLERY:
        return rows * columns;
      case LAYOUT_TYPES.ROUND_TABLE:
        return tables * seatsPerTable;
      case LAYOUT_TYPES.OPEN_CROWD:
        return capacity;
      default:
        return 0;
    }
  };

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    let layoutConfig;

    switch (layoutType) {
      case LAYOUT_TYPES.ROW_COLUMN:
      case LAYOUT_TYPES.GALLERY:
        layoutConfig = {
          rows: Number(rows),
          columns: Number(columns),
        };
        break;
      case LAYOUT_TYPES.ROUND_TABLE:
        layoutConfig = {
          tables: Number(tables),
          seatsPerTable: Number(seatsPerTable),
        };
        break;
      case LAYOUT_TYPES.OPEN_CROWD:
        layoutConfig = {
          capacity: Number(capacity),
        };
        break;
      default:
        setError("Invalid layout type");
        setLoading(false);
        return;
    }

    try {
      await organizerApi.createVenueForEvent(eventId, {
        name,
        location,
        layoutType,
        layoutConfig,
      });
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent tracking-tight mb-4">
            Venue Setup
          </h1>
          <p className="text-xl text-slate-400 font-medium">Step 2 of 3: Configure your venue layout</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-4xl border border-slate-700/50 shadow-2xl overflow-hidden">
          
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
          <form onSubmit={submit} className="p-8 space-y-8">
            
            {/* Basic Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center">
                  <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Venue Name
                </label>
                <input
                  className="w-full px-5 py-4 bg-white/10 backdrop-blur-sm border border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-500 focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all duration-300 font-medium focus:outline-none hover:border-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="e.g., Grand Hall A"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center">
                  <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Location
                </label>
                <input
                  className="w-full px-5 py-4 bg-white/10 backdrop-blur-sm border border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-500 focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all duration-300 font-medium focus:outline-none hover:border-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="e.g., 123 Main St, City"
                />
              </div>
            </div>

            {/* YOUR EXISTING DROPDOWN COMPONENT */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center">
                <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m14 0h2" />
                </svg>
                Layout Type
              </label>
              <Dropdown
                options={layoutOptions}
                value={layoutType}
                onChange={(value) => setLayoutType(value)}
                disabled={loading}
                placeholder="Select layout type"
                className="w-full"
              />
            </div>

            {/* Dynamic Layout Configs */}
            {(layoutType === LAYOUT_TYPES.ROW_COLUMN || layoutType === LAYOUT_TYPES.GALLERY) && (
              <div className="grid grid-cols-2 gap-6 p-6 bg-slate-800/30 rounded-3xl border border-slate-700/50">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Rows</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    className="w-full px-5 py-4 bg-white/20 backdrop-blur-sm border border-emerald-500/30 rounded-2xl text-slate-100 focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 font-mono text-lg"
                    value={rows}
                    onChange={(e) => setRows(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Columns</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    className="w-full px-5 py-4 bg-white/20 backdrop-blur-sm border border-emerald-500/30 rounded-2xl text-slate-100 focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 font-mono text-lg"
                    value={columns}
                    onChange={(e) => setColumns(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>
              </div>
            )}

            {layoutType === LAYOUT_TYPES.ROUND_TABLE && (
              <div className="grid grid-cols-2 gap-6 p-6 bg-slate-800/30 rounded-3xl border border-slate-700/50">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-purple-400 uppercase tracking-wider">Tables</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    className="w-full px-5 py-4 bg-white/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl text-slate-100 focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 font-mono text-lg"
                    value={tables}
                    onChange={(e) => setTables(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-purple-400 uppercase tracking-wider">Seats/Table</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    className="w-full px-5 py-4 bg-white/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl text-slate-100 focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500 transition-all duration-300 font-mono text-lg"
                    value={seatsPerTable}
                    onChange={(e) => setSeatsPerTable(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>
              </div>
            )}

            {layoutType === LAYOUT_TYPES.OPEN_CROWD && (
              <div className="p-6 bg-slate-800/30 rounded-3xl border border-slate-700/50">
                <label className="text-sm font-bold text-rose-400 uppercase tracking-wider block mb-4">Total Capacity</label>
                <input
                  type="number"
                  min="1"
                  max="5000"
                  className="w-full max-w-md px-5 py-4 bg-white/20 backdrop-blur-sm border border-rose-500/30 rounded-2xl text-slate-100 focus:ring-4 focus:ring-rose-500/50 focus:border-rose-500 transition-all duration-300 font-mono text-2xl font-bold mx-auto block text-center"
                  value={capacity}
                  onChange={(e) => setCapacity(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>
            )}

            {/* Live Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-100 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                  Live Preview
                </h3>
                <div className="text-2xl font-black text-emerald-400">
                  {getTotalCapacity()} seats
                </div>
              </div>

              <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-slate-700/50 backdrop-blur-xl min-h-64 flex items-center justify-center">
                {(layoutType === LAYOUT_TYPES.ROW_COLUMN || layoutType === LAYOUT_TYPES.GALLERY) && (
                  <div 
                    className="inline-grid gap-1 p-4 bg-white/10 rounded-2xl backdrop-blur-sm max-h-80 overflow-auto"
                    style={{
                      gridTemplateColumns: `repeat(${Math.min(columns, 30)}, 12px)`,
                      maxWidth: '100%'
                    }}
                  >
                    {Array.from({ length: rows * columns }).map((_, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 bg-slate-400/50 hover:bg-emerald-400/80 rounded transition-colors duration-200 cursor-pointer"
                      />
                    ))}
                  </div>
                )}

                {layoutType === LAYOUT_TYPES.ROUND_TABLE && (
                  <div className="flex flex-wrap gap-4 justify-center">
                    {Array.from({ length: Math.min(tables, 20) }).map((_, i) => (
                      <div
                        key={i}
                        className="w-20 h-20 bg-gradient-to-br from-purple-500/60 to-purple-600/60 rounded-2xl flex items-center justify-center text-white font-bold shadow-2xl hover:scale-110 hover:rotate-12 transition-all duration-300 border-4 border-white/20"
                      >
                        {seatsPerTable}
                      </div>
                    ))}
                    {tables > 20 && (
                      <div className="w-20 h-20 bg-slate-700/50 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-sm border-2 border-dashed border-slate-600/50">
                        +{tables - 20} more
                      </div>
                    )}
                  </div>
                )}

                {layoutType === LAYOUT_TYPES.OPEN_CROWD && (
                  <div className="text-center space-y-4 max-w-2xl mx-auto">
                    <div className="w-32 h-32 bg-gradient-to-br from-rose-500/30 to-rose-600/30 rounded-3xl border-4 border-dashed border-rose-500/50 flex items-center justify-center mx-auto backdrop-blur-xl">
                      <svg className="w-16 h-16 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-4xl font-black text-slate-200">{capacity}</p>
                      <p className="text-slate-400 text-lg font-medium mt-2">Standing Capacity</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                disabled={loading}
                onClick={() => navigate(`/organizer/events/${eventId}`)}
                className="flex-1 px-10 py-5 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-slate-300 font-bold rounded-3xl hover:bg-slate-700/50 hover:border-slate-600/50 hover:text-slate-200 transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-slate-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 group relative px-10 py-5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold rounded-3xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/50 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 -z-10" />
                <span className="relative flex items-center justify-center">
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                      Next: Seat Categories
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
