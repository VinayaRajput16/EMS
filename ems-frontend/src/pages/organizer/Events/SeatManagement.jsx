// src/pages/organizer/Events/SeatManagement.jsx - FIXED COMPACT SIZING
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { organizerApi } from "../../../api/organizer.api";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function SeatManagement() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const getSeatByLabel = (label) => {
  return seats.find(seat => seat.label === label);
};

  useEffect(() => {
    const loadEventAndSeats = async () => {
      setLoading(true);
      try {
        const [eventRes, seatsRes] = await Promise.all([
          organizerApi.getEventById(eventId),
          organizerApi.getEventSeats(eventId)
        ]);
        
        setEvent(eventRes.data.data);
        setSeats(seatsRes.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load seats");
        setLoading(false);
      }
    };

    loadEventAndSeats();
  }, [eventId]);

  const getSeatsByCategory = () => {
    const filtered = seats.filter(seat => {
      const statusMatch = 
        filter === "ALL" ? true :
        filter === "AVAILABLE" ? seat.status === "AVAILABLE" :
        seat.status === "ALLOCATED";
      
      const categoryMatch = 
        selectedCategory === "ALL" ? true :
        seat.category.id === selectedCategory;

      return statusMatch && categoryMatch;
    });

    return filtered.reduce((acc, seat) => {
      const categoryId = seat.category.id;
      if (!acc[categoryId]) {
        acc[categoryId] = {
          categoryId: seat.category.id,
          categoryName: seat.category.name,
          priority: seat.category.priority,
          seats: [],
        };
      }
      acc[categoryId].seats.push(seat);
      return acc;
    }, {});
  };

  const groupedSeats = getSeatsByCategory();
  const categories = Object.values(groupedSeats).sort((a, b) => a.priority - b.priority);
  const allCategories = Array.from(
    new Set(seats.map(s => ({ id: s.category.id, name: s.category.name, priority: s.category.priority })))
  ).sort((a, b) => a.priority - b.priority);

  const getStats = () => {
    const total = seats.length;
    const available = seats.filter(s => s.status === "AVAILABLE").length;
    const allocated = seats.filter(s => s.status === "ALLOCATED").length;
    return { total, available, allocated };
  };

  const stats = getStats();

  // Layout renderers
  const renderRowColumnLayout = () => {
    const { rows, columns } = event.venue.layoutConfig;
    
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6 max-h-[70vh] overflow-hidden">
        {/* Stage */}
        <div className="mb-6 text-center relative z-10">
          <div className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600/90 to-indigo-600/90 backdrop-blur-md text-white text-center rounded-2xl shadow-lg border-2 border-purple-500/50 mx-auto">
            <span className="text-lg font-bold tracking-wide">🎭 STAGE</span>
          </div>
        </div>

        {/* FIXED: Contained Grid - No Overflow */}
        <div className="max-w-5xl mx-auto max-h-[calc(70vh-150px)] overflow-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-900/50">
          <div className="space-y-2 min-w-[800px]">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex items-center justify-center gap-1 px-4 h-12">
                {/* Row Label Left */}
                <div className="w-10 h-10 flex items-center justify-center font-bold text-sm text-slate-300 bg-slate-800/80 backdrop-blur-xl rounded-lg border border-slate-600/70 shadow-md flex-shrink-0">
                  {String.fromCharCode(65 + rowIndex)}
                </div>

                {/* Seats - Fixed spacing */}
                <div className="flex gap-1 flex-1 min-w-[600px] max-w-[600px] px-2">
                  {Array.from({ length: columns }).map((_, colIndex) => {
                    const seatLabel = `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`;
                    const seat = getSeatByLabel(seatLabel);
                    
                    return (
                      <SeatIcon
                        key={seatLabel}
                        seat={seat}
                        label={seatLabel}
                        size="w-9 h-9"
                      />
                    );
                  })}
                </div>

                {/* Row Label Right */}
                <div className="w-10 h-10 flex items-center justify-center font-bold text-sm text-slate-300 bg-slate-800/80 backdrop-blur-xl rounded-lg border border-slate-600/70 shadow-md flex-shrink-0">
                  {String.fromCharCode(65 + rowIndex)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // FIXED SeatIcon - Perfect size control
  function SeatIcon({ seat, label, size = "w-10 h-10 text-sm", compact = false }) {
    const finalSize = compact ? "w-8 h-8 text-xs" : size;
    
    if (!seat) {
      return (
        <div 
          className={`${finalSize} bg-slate-800/80 border-2 border-slate-700/70 rounded-lg backdrop-blur-xl flex items-center justify-center text-slate-400 shadow-md flex-shrink-0`}
          title="No seat data"
        >
          —
        </div>
      );
    }

    const isAvailable = seat.status === "AVAILABLE";
    
    return (
      <div
        className={`${finalSize} rounded-lg backdrop-blur-xl flex items-center justify-center font-bold shadow-lg border-2 flex-shrink-0 group hover:scale-105 hover:shadow-xl transition-all duration-200 cursor-default ${
          isAvailable
            ? "bg-gradient-to-br from-emerald-500/40 to-emerald-600/40 text-emerald-100 border-emerald-500/80 shadow-emerald-500/50"
            : "bg-gradient-to-br from-rose-500/40 to-rose-600/40 text-rose-100 border-rose-500/80 shadow-rose-500/50"
        }`}
        title={`${label || seat.label} - ${seat.status}${seat.issuedTickets?.[0]?.user?.email ? `\nUser: ${seat.issuedTickets[0].user.email}` : ""}`}
      >
        {isAvailable ? "✓" : "🔒"}
      </div>
    );
  }

  const renderGalleryLayout = () => {
    const { rows, columns } = event.venue.layoutConfig;
    
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6">
        {/* Gallery Info */}
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent mb-2">🖼️ Gallery Layout</h3>
          <p className="text-base text-slate-400 font-medium backdrop-blur-sm bg-slate-900/30 rounded-xl py-2 px-4 border border-slate-700/50">Standing/Gallery Style Seating</p>
        </div>

        {/* Seats Grid */}
        <div className="space-y-2">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex gap-2 justify-center">
              {Array.from({ length: columns }).map((_, colIndex) => {
                const seatNumber = rowIndex * columns + colIndex;
                const seat = seats[seatNumber];
                
                return (
                  <SeatIcon
                    key={`${rowIndex}-${colIndex}`}
                    seat={seat}
                    label={`${rowIndex + 1}-${colIndex + 1}`}
                    compact
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRoundTableLayout = () => {
    const { tables, seatsPerTable } = event.venue.layoutConfig;
    const tablesPerRow = Math.ceil(Math.sqrt(tables));
    
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6">
        {/* Info */}
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent mb-2">🪑 Round Table Layout</h3>
          <p className="text-base text-slate-400 font-medium backdrop-blur-sm bg-slate-900/30 rounded-xl py-2 px-4 border border-slate-700/50">
            {tables} Tables • {seatsPerTable} Seats Each
          </p>
        </div>

        {/* Tables Grid */}
        <div className="grid gap-8" style={{
          gridTemplateColumns: `repeat(${tablesPerRow}, minmax(0, 1fr))`
        }}>
          {Array.from({ length: tables }).map((_, tableIndex) => (
            <div key={tableIndex} className="flex flex-col items-center">
              {/* Table Number */}
              <div className="text-base font-bold text-slate-200 mb-4 bg-gradient-to-br from-amber-500 to-amber-600 px-4 py-2 rounded-xl shadow-lg border border-amber-400/50">
                Table {tableIndex + 1}
              </div>
              
              {/* Round Table with Seats */}
              <div className="relative" style={{ width: '140px', height: '140px' }}>
                {/* Table Center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500/90 to-amber-600/90 border-2 border-amber-400/80 shadow-lg flex items-center justify-center backdrop-blur-xl">
                    <span className="text-sm font-bold text-white">T{tableIndex + 1}</span>
                  </div>
                </div>

                {/* Seats Around Table */}
                {Array.from({ length: seatsPerTable }).map((_, seatIndex) => {
                  const angle = (seatIndex / seatsPerTable) * 2 * Math.PI - Math.PI / 2;
                  const radius = 60;
                  const x = 70 + radius * Math.cos(angle);
                  const y = 70 + radius * Math.sin(angle);
                  
                  const globalSeatIndex = tableIndex * seatsPerTable + seatIndex;
                  const seat = seats[globalSeatIndex];

                  return (
                    <div
                      key={seatIndex}
                      className="absolute"
                      style={{
                        left: `${x}px`,
                        top: `${y}px`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <SeatIcon
                        seat={seat}
                        label={`T${tableIndex + 1}-${seatIndex + 1}`}
                        compact
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderOpenCrowdLayout = () => {
    const { capacity } = event.venue.layoutConfig;
    const seatsPerRow = Math.ceil(Math.sqrt(capacity));
    
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6">
        {/* Info */}
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent mb-2">👥 Open Crowd Layout</h3>
          <p className="text-base text-slate-400 font-medium backdrop-blur-sm bg-slate-900/30 rounded-xl py-2 px-4 border border-slate-700/50">Standing Area • Capacity: {capacity}</p>
        </div>

        {/* Scattered/Grid View */}
        <div className="grid gap-3" style={{
          gridTemplateColumns: `repeat(${seatsPerRow}, minmax(0, 1fr))`
        }}>
          {seats.map((seat, index) => (
            <SeatIcon
              key={seat.id || index}
              seat={seat}
              label={seat.label}
              compact
            />
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 flex items-center justify-center p-8">
        <LoadingSpinner className="w-16 h-16 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 text-white p-4 md:p-6">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-20 w-64 h-64 lg:w-96 lg:h-96 bg-gradient-to-r from-emerald-900/20 to-emerald-800/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-20 w-64 h-64 lg:w-72 lg:h-72 bg-gradient-to-l from-purple-900/20 to-purple-800/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/organizer/events/${eventId}`)}
            className="group mb-6 inline-flex items-center px-4 py-2 bg-slate-800/50 backdrop-blur-md border border-slate-700/50 text-slate-300 font-medium rounded-xl hover:bg-slate-700/70 hover:border-emerald-500/50 hover:text-emerald-300 transition-all duration-300 shadow-lg"
          >
            <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Event
          </button>
          
          <div className="bg-white/10 backdrop-blur-3xl rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent mb-3">
                  🎫 Seat Management
                </h1>
                <p className="text-xl text-slate-300 font-bold mb-4">{event?.title}</p>
                <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                  <span className="flex items-center gap-2 bg-slate-800/50 backdrop-blur px-4 py-2 rounded-xl border border-slate-700/50">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {event?.venue?.name}
                  </span>
                  <span className="flex items-center gap-2 bg-slate-800/50 backdrop-blur px-4 py-2 rounded-xl border border-slate-700/50">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {event?.venue?.layoutType?.replace('_', ' ')}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="font-semibold text-slate-300">Mode:</span> 
                    <span className={`px-4 py-2 rounded-xl font-bold text-sm backdrop-blur-sm border ${
                      event?.allocationMode === 'AUTOMATED' 
                        ? 'bg-gradient-to-r from-purple-500/20 to-purple-600/20 border-purple-500/50 text-purple-200' 
                        : 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border-emerald-500/50 text-emerald-200'
                    }`}>
                      {event?.allocationMode}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="group bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 font-medium mb-1 text-sm">Total Seats</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 border border-slate-700/50 shadow-md">
                <svg className="w-6 h-6 text-slate-300 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </div>

          <div className="group bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-lg hover:shadow-green-500/30 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 font-medium mb-1 text-sm">Available</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">{stats.available}</p>
              </div>
              <div className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/20 border border-slate-700/50 shadow-md">
                <svg className="w-6 h-6 text-slate-300 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="group bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-lg hover:shadow-red-500/30 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 font-medium mb-1 text-sm">Allocated</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-rose-500 bg-clip-text text-transparent">{stats.allocated}</p>
              </div>
              <div className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center group-hover:bg-rose-500/20 border border-slate-700/50 shadow-md">
                <svg className="w-6 h-6 text-slate-300 group-hover:text-rose-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-3xl rounded-2xl shadow-xl p-6 mb-8 border border-white/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter by Status
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setFilter("ALL")}
                  className={`px-4 py-3 rounded-xl font-bold text-sm backdrop-blur-xl border-2 transition-all duration-300 shadow-md ${
                    filter === "ALL"
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-700 border-emerald-500/50 text-white shadow-emerald-500/50 scale-105"
                      : "bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-200"
                  }`}
                >
                  All Seats
                </button>
                <button
                  onClick={() => setFilter("AVAILABLE")}
                  className={`px-4 py-3 rounded-xl font-bold text-sm backdrop-blur-xl border-2 transition-all duration-300 shadow-md ${
                    filter === "AVAILABLE"
                      ? "bg-gradient-to-r from-emerald-600 to-emerald-700 border-emerald-500/50 text-white shadow-emerald-500/50 scale-105"
                      : "bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-200"
                  }`}
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                    </svg>
                    Available
                  </span>
                </button>
                <button
                  onClick={() => setFilter("ALLOCATED")}
                  className={`px-4 py-3 rounded-xl font-bold text-sm backdrop-blur-xl border-2 transition-all duration-300 shadow-md ${
                    filter === "ALLOCATED"
                      ? "bg-gradient-to-r from-rose-600 to-rose-700 border-rose-500/50 text-white shadow-rose-500/50 scale-105"
                      : "bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-rose-500/50 hover:text-rose-200"
                  }`}
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                    Allocated
                  </span>
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-xl border-2 border-slate-700/50 rounded-xl text-base font-bold text-slate-100 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/70 transition-all duration-300 hover:border-emerald-500/50 shadow-md appearance-none cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                {allCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-rose-500/10 backdrop-blur-xl border border-rose-500/40 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center space-x-3">
              <svg className="w-6 h-6 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-rose-200 font-medium text-base flex-1">{error}</p>
            </div>
          </div>
        )}

        {/* Venue Layout Visualization */}
        {event?.venue && (
          <div className="mb-8">
            {event.venue.layoutType === "ROW_COLUMN" && renderRowColumnLayout()}
            {event.venue.layoutType === "GALLERY" && renderGalleryLayout()}
            {event.venue.layoutType === "ROUND_TABLE" && renderRoundTableLayout()}
            {event.venue.layoutType === "OPEN_CROWD" && renderOpenCrowdLayout()}
          </div>
        )}

        {/* Category Breakdown */}
        {categories.length > 0 && (
          <div className="space-y-6 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent text-center mb-2">📊 Category Breakdown</h2>
            {categories.map((category) => (
              <div key={category.categoryId} className="bg-white/10 backdrop-blur-3xl rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-emerald-500/30 hover:-translate-y-1 transition-all duration-300">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-5 pb-5 border-b border-slate-800/50">
                  <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent mb-3 lg:mb-0">
                    {category.categoryName}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="px-4 py-2 bg-emerald-500/20 backdrop-blur border border-emerald-500/50 text-emerald-200 font-bold rounded-xl">
                      {category.seats.filter(s => s.status === "AVAILABLE").length} Available
                    </span>
                    <span className="px-4 py-2 bg-rose-500/20 backdrop-blur border border-rose-500/50 text-rose-200 font-bold rounded-xl">
                      {category.seats.filter(s => s.status === "ALLOCATED").length} Allocated
                    </span>
                    <span className="px-4 py-2 bg-slate-700/50 backdrop-blur border border-slate-600/50 text-slate-200 font-bold rounded-xl">
                      {category.seats.length} Total
                    </span>
                  </div>
                </div>

                {/* Seat Labels List */}
                <div className="flex flex-wrap gap-2 p-4 bg-slate-900/30 backdrop-blur-xl rounded-xl border border-slate-800/50">
                  {category.seats.map((seat) => (
                    <div
                      key={seat.id}
                      className={`px-3 py-2 rounded-xl text-sm font-bold transition-all shadow-md border backdrop-blur-sm ${
                        seat.status === "AVAILABLE"
                          ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-200 hover:bg-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105"
                          : "bg-rose-500/20 border-rose-500/50 text-rose-200 hover:bg-rose-500/30 hover:shadow-rose-500/50 hover:scale-105"
                      }`}
                      title={seat.issuedTickets?.[0]?.user?.email || "No user assigned"}
                    >
                      {seat.label}
                      {seat.status === "ALLOCATED" && " 🔒"}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="bg-white/10 backdrop-blur-3xl rounded-2xl shadow-xl p-6 border border-white/20">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent mb-5 text-center">Legend</h3>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-3 p-4 bg-slate-900/30 backdrop-blur-xl rounded-xl border border-slate-800/50 shadow-md">
              <div className="w-10 h-10 bg-emerald-500/20 border-2 border-emerald-500/50 rounded-xl shadow-emerald-500/30 flex items-center justify-center">
                <span className="text-lg font-bold text-emerald-400">✓</span>
              </div>
              <span className="text-base font-medium text-slate-300">Available Seat</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-900/30 backdrop-blur-xl rounded-xl border border-slate-800/50 shadow-md">
              <div className="w-10 h-10 bg-rose-500/20 border-2 border-rose-500/50 rounded-xl shadow-rose-500/30 flex items-center justify-center">
                <span className="text-lg font-bold text-rose-400">🔒</span>
              </div>
              <span className="text-base font-medium text-slate-300">Allocated Seat</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Seat Icon Component - COMPACT VERSION
function SeatIcon({ seat, label, compact = false }) {
  const size = compact ? "w-10 h-10 text-sm" : "w-12 h-12 text-base";
  
  if (!seat) {
    return (
      <div 
        className={`${size} bg-slate-800/50 border-2 border-slate-700/50 rounded-xl backdrop-blur flex items-center justify-center text-slate-500 shadow-md hover:shadow-slate-500/30 hover:scale-105 transition-all duration-300`}
        title="No seat data"
      >
        —
      </div>
    );
  }

  const isAvailable = seat.status === "AVAILABLE";
  
  return (
    <div
      className={`${size} rounded-xl backdrop-blur flex items-center justify-center font-bold shadow-lg transition-all duration-300 cursor-pointer hover:scale-110 hover:shadow-xl hover:-translate-y-1 border-2 ${
        isAvailable
          ? "bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 text-emerald-400 border-emerald-500/60 shadow-emerald-500/50 hover:from-emerald-500/40 hover:shadow-emerald-500/70"
          : "bg-gradient-to-br from-rose-500/20 to-rose-600/20 text-rose-400 border-rose-500/60 shadow-rose-500/50 hover:from-rose-500/40 hover:shadow-rose-500/70"
      }`}
      title={`${label || seat.label} - ${seat.status}${
        seat.issuedTickets?.[0]?.user?.email 
          ? `\nUser: ${seat.issuedTickets[0].user.email}` 
          : ""
      }`}
    >
      {isAvailable ? "✓" : "🔒"}
    </div>
  );
}