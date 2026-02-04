// src/pages/user/UserDashboard.jsx - ELITE DARK THEME + PROPER LINKS
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getUserFromToken } from "../../auth/useAuth";

export default function UserDashboard() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const tokenUser = getUserFromToken();
  const [user] = useState(tokenUser);

  useEffect(() => {
    // Verify the logged-in user matches the dashboard userId
    if (!tokenUser || tokenUser.userId !== userId) {
      navigate("/login"); // Fixed redirect path
    }
  }, [userId, navigate, tokenUser]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 text-white">
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent tracking-tight">
                Dashboard
              </h1>
              <p className="text-slate-400 text-lg mt-1">Welcome back, {user.name || 'User'}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="group px-6 py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-semibold rounded-2xl shadow-lg hover:shadow-rose-500/50 hover:-translate-y-1 transition-all duration-300 border border-rose-500/50 backdrop-blur-sm"
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* User Profile Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-10 border border-white/20 hover:shadow-emerald-500/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white/20">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Profile</h2>
                <p className="text-emerald-400 font-semibold text-lg">USER</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-sm mb-1">User ID</p>
              <p className="text-white font-mono font-bold text-lg">{userId}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* My Bookings */}
          <Link
            to={`/user/${userId}/bookings`}
            className="group bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-2 hover:border-emerald-500/50 transition-all duration-300 hover:bg-white/20"
          >
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur border-2 border-blue-500/30 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 group-hover:scale-105 transition-all duration-300">
                <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">My Bookings</h3>
                <p className="text-slate-400 text-sm">View and manage your event bookings</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-sm">Manage</span>
              <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* My Tickets */}
          <Link
            to={`/user/${userId}/bookings`}
            className="group bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-2 hover:border-green-500/50 transition-all duration-300 hover:bg-white/20"
          >
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur border-2 border-green-500/30 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-green-500/50 group-hover:scale-105 transition-all duration-300">
                <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-green-300 transition-colors">My Tickets</h3>
                <p className="text-slate-400 text-sm">Access your digital event tickets</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-sm">Access</span>
              <svg className="w-5 h-5 text-slate-400 group-hover:text-green-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Browse Events */}
          <Link
            to={`/user/${userId}/events`}
            className="group bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-2 hover:border-purple-500/50 transition-all duration-300 hover:bg-white/20"
          >
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur border-2 border-purple-500/30 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 group-hover:scale-105 transition-all duration-300">
                <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">Browse Events</h3>
                <p className="text-slate-400 text-sm">Discover upcoming events near you</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-sm">Explore</span>
              <svg className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <svg className="w-8 h-8 mr-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            Recent Activity
          </h2>
          <div className="text-center py-12">
            <svg className="w-20 h-20 text-slate-600 mx-auto mb-6 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <h4 className="text-xl font-semibold text-slate-400 mb-2">No recent activity</h4>
            <p className="text-slate-500 text-base">Your bookings and tickets will appear here</p>
          </div>
        </div>
      </main>
    </div>
  );
}
