// src/layouts/OrganizerLayout.jsx
import { Outlet, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function OrganizerLayout() {
  const location = useLocation();

  const navItems = [
    { path: "/organizer/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/organizer/events", label: "Events", icon: "🎫" },
    { path: "/organizer/analytics", label: "Analytics", icon: "📈" }
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-slate-800/50 bg-white/5 backdrop-blur-xl shadow-2xl flex-shrink-0">
        {/* Header */}
        <div className="p-8 border-b border-slate-800/50 bg-gradient-to-b from-slate-900/80 to-transparent">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center shadow-xl">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">Organizer</h1>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Control Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative flex items-center px-6 py-4 rounded-2xl text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-emerald-600/90 to-emerald-700/90 text-white shadow-2xl border border-emerald-500/50 backdrop-blur-xl scale-105'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/10 hover:shadow-lg hover:border-slate-700/50 border border-transparent hover:scale-[1.02]'
                }`}
              >
                <span className="w-2 h-2 mr-4 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100" />
                <span className="mr-3 text-xl flex-shrink-0">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ml-auto ${
                  isActive(item.path)
                    ? 'bg-white opacity-100 scale-100'
                    : 'bg-slate-500/50 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100'
                }`} />
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-800/50 my-8" />

          {/* Quick Actions */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-4">Quick Actions</div>
            <Link
              to="/organizer/events/create"
              className="group flex items-center px-6 py-4 rounded-2xl text-sm font-bold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-600/20 hover:shadow-emerald-500/30 hover:-translate-y-px transition-all duration-300 border border-emerald-600/30"
            >
              <svg className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Event
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
