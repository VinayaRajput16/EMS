// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../api/auth.api";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await authApi.register(formData);
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      const user = response.data.user;
      if (user.role === "ORGANIZER") {
        navigate("/organizer/dashboard");
      } else if (user.role === "USER") {
        navigate(`/user/${user.id}/dashboard`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 text-white flex items-center justify-center p-4 sm:p-6">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-40 h-40 sm:w-56 sm:h-56 bg-gradient-to-r from-emerald-900/20 to-emerald-800/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-52 h-52 sm:w-72 sm:h-72 bg-gradient-to-l from-rose-900/15 to-rose-800/15 rounded-full blur-2xl animate-pulse"></div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md lg:max-w-lg bg-white/5 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-2xl p-6 sm:p-8">

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-xl border-2 border-white/20">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent tracking-tight mb-1.5">
            Create Account
          </h1>
          <p className="text-sm sm:text-base text-slate-400 font-medium">Join as User or Organizer</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/40 rounded-xl p-3 sm:p-4 mb-5 flex items-center space-x-3">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-sm text-rose-300 font-medium flex-1">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
              <svg className="w-3.5 h-3.5 mr-1.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 sm:py-3 bg-slate-800/95 border-2 border-slate-700/50 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500/70 transition-all duration-300 font-medium outline-none"
              placeholder="John Doe"
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
              <svg className="w-3.5 h-3.5 mr-1.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.27 5.05c.4.28.94.28 1.34 0L21 8M5.02 17h13.96a2 2 0 002-2V9a2 2 0 00-2-2H5.02a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 sm:py-3 bg-slate-800/95 border-2 border-slate-700/50 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500/70 transition-all duration-300 font-medium outline-none"
              placeholder="john@example.com"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center">
              <svg className="w-3.5 h-3.5 mr-1.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 sm:py-3 bg-slate-800/95 border-2 border-slate-700/50 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500/70 transition-all duration-300 font-medium outline-none"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Register As
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="group relative p-3 sm:p-4 bg-slate-800/70 border-2 border-slate-700/50 rounded-xl cursor-pointer hover:border-emerald-500/50 hover:-translate-y-0.5 transition-all duration-300">
                <input
                  type="radio"
                  name="role"
                  value="USER"
                  checked={formData.role === "USER"}
                  onChange={handleChange}
                  className="sr-only"
                  disabled={loading}
                />
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className={`w-4 h-4 rounded-full border-4 transition-all duration-300 ${formData.role === "USER" ? 'bg-emerald-500 border-emerald-500 scale-110' : 'border-slate-600/50'}`} />
                  <div>
                    <div className="font-bold text-sm text-slate-100 group-hover:text-emerald-400">Attendee</div>
                    <div className="text-xs text-slate-400">Book events</div>
                  </div>
                </div>
              </label>

              <label className="group relative p-3 sm:p-4 bg-slate-800/70 border-2 border-slate-700/50 rounded-xl cursor-pointer hover:border-purple-500/50 hover:-translate-y-0.5 transition-all duration-300">
                <input
                  type="radio"
                  name="role"
                  value="ORGANIZER"
                  checked={formData.role === "ORGANIZER"}
                  onChange={handleChange}
                  className="sr-only"
                  disabled={loading}
                />
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className={`w-4 h-4 rounded-full border-4 transition-all duration-300 ${formData.role === "ORGANIZER" ? 'bg-purple-500 border-purple-500 scale-110' : 'border-slate-600/50'}`} />
                  <div>
                    <div className="font-bold text-sm text-slate-100 group-hover:text-purple-400">Organizer</div>
                    <div className="text-xs text-slate-400">Host events</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full px-6 py-3 sm:py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-sm sm:text-base font-bold text-white rounded-xl shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden focus:outline-none focus:ring-4 focus:ring-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/40 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative flex items-center justify-center">
              {loading ? (
                <>
                  <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Sign Up Free
                </>
              )}
            </span>
          </button>
        </form>

        {/* Footer */}
        <div className="pt-5 mt-5 border-t border-slate-800/50 text-center">
          <p className="text-sm text-slate-400 mb-3">Already have an account?</p>
          <Link
            to="/organizer/login"
            className="group inline-flex items-center px-5 py-2.5 bg-slate-800/80 border-2 border-slate-700/50 text-slate-300 text-sm font-bold rounded-xl hover:bg-slate-700/80 hover:border-slate-600/70 hover:text-slate-200 hover:-translate-y-0.5 transition-all duration-300 shadow-md"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Sign In
          </Link>
        </div>
      </div>

      <style jsx>{`
        .sr-only {
          position: absolute; width: 1px; height: 1px;
          padding: 0; margin: -1px; overflow: hidden;
          clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
        }
      `}</style>
    </div>
  );
}