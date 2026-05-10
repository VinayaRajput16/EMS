// src/pages/user/UserDashboard.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getUserFromToken } from "../../auth/useAuth";

export default function UserDashboard() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const tokenUser = getUserFromToken();
  const [user] = useState(tokenUser);

  useEffect(() => {
    if (!tokenUser || tokenUser.userId !== userId) {
      navigate("/login");
    }
  }, [userId, navigate, tokenUser]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 text-white">
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent tracking-tight">
                Dashboard
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">Welcome back, {user.name || 'User'}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="group px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-semibold rounded-xl shadow-md hover:shadow-rose-500/40 hover:-translate-y-0.5 transition-all duration-300 border border-rose-500/50 text-sm"
            >
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* User Profile Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-5 mb-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-white/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Profile</h2>
                <p className="text-emerald-400 font-semibold text-xs">USER</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-xs mb-0.5">User ID</p>
              <p className="text-white font-mono font-bold text-sm">{userId}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* My Bookings */}
          <Link
            to={`/user/${userId}/bookings`}
            className="group bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-md hover:shadow-emerald-500/30 hover:-translate-y-1 hover:border-emerald-500/40 transition-all duration-300 hover:bg-white/15"
          >
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl flex items-center justify-center group-hover:shadow-blue-500/40 group-hover:scale-105 transition-all duration-300">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">My Bookings</h3>
                <p className="text-slate-400 text-xs mt-0.5">View and manage your event bookings</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-xs">Manage</span>
              <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* My Tickets */}
          <Link
            to={`/user/${userId}/bookings`}
            className="group bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-md hover:shadow-emerald-500/30 hover:-translate-y-1 hover:border-green-500/40 transition-all duration-300 hover:bg-white/15"
          >
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl flex items-center justify-center group-hover:shadow-green-500/40 group-hover:scale-105 transition-all duration-300">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-green-300 transition-colors">My Tickets</h3>
                <p className="text-slate-400 text-xs mt-0.5">Access your digital event tickets</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-xs">Access</span>
              <svg className="w-4 h-4 text-slate-400 group-hover:text-green-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Browse Events */}
          <Link
            to={`/user/${userId}/events`}
            className="group bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 shadow-md hover:shadow-emerald-500/30 hover:-translate-y-1 hover:border-purple-500/40 transition-all duration-300 hover:bg-white/15"
          >
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-xl flex items-center justify-center group-hover:shadow-purple-500/40 group-hover:scale-105 transition-all duration-300">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">Browse Events</h3>
                <p className="text-slate-400 text-xs mt-0.5">Discover upcoming events near you</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-xs">Explore</span>
              <svg className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-5 border border-white/20">
          <h2 className="text-base font-bold text-white mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            Recent Activity
          </h2>
          <div className="text-center py-8">
            <h4 className="text-sm font-semibold text-slate-400 mb-1">No recent activity</h4>
            <p className="text-slate-500 text-xs">Your bookings and tickets will appear here</p>
          </div>
        </div>
      </main>
    </div>
  );
}