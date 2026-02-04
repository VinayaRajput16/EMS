// src/pages/Register.jsx - FULL CODE WITH FIXED WIDTH
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Registration successful - redirect to login
      navigate("/admin/login");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 text-white flex items-center justify-center p-6 lg:p-12">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-gradient-to-r from-emerald-900/20 to-emerald-800/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gradient-to-l from-rose-900/15 to-rose-800/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-grid-slate/[0.08] bg-center [mask-image:radial-gradient(ellipse_80%_50%_at_50%_-20%,white,transparent)]"></div>
      </div>

      {/* ✅ FIXED - Much Wider Main Card */}
      <div className="relative z-10 w-full max-w-2xl lg:max-w-3xl bg-white/5 backdrop-blur-3xl rounded-4xl border border-white/10 shadow-2xl p-10 lg:p-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl border-4 border-white/20">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent tracking-tight mb-4">
            Create Account
          </h1>
          <p className="text-xl text-slate-400 font-semibold">Join as User or Organizer</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-500/10 backdrop-blur-sm border border-rose-500/40 rounded-3xl p-6 mb-10 flex items-center space-x-4 animate-pulse">
            <svg className="w-6 h-6 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-rose-300 font-medium flex-1">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Name */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center">
              <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="w-full px-6 py-5 bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-md border-2 border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-500 focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500/70 transition-all duration-300 font-semibold shadow-lg hover:shadow-emerald-500/20 outline-none"
              placeholder="John Doe"
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center">
              <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="w-full px-6 py-5 bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-md border-2 border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-500 focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500/70 transition-all duration-300 font-semibold shadow-lg hover:shadow-emerald-500/20 outline-none"
              placeholder="john@example.com"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center">
              <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="w-full px-6 py-5 bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-md border-2 border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-500 focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500/70 transition-all duration-300 font-semibold shadow-lg hover:shadow-emerald-500/20 outline-none"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-300 uppercase tracking-wider block">
              Register As
            </label>
            <div className="grid grid-cols-2 gap-6">
              <label className="group relative p-8 bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-md border-2 border-slate-700/50 rounded-3xl cursor-pointer hover:border-emerald-500/50 hover:shadow-emerald-500/20 hover:-translate-y-1 transition-all duration-300 hover:bg-slate-700/80 focus:outline-none focus:ring-4 focus:ring-emerald-500/30">
                <input
                  type="radio"
                  name="role"
                  value="USER"
                  checked={formData.role === "USER"}
                  onChange={handleChange}
                  className="sr-only"
                  disabled={loading}
                />
                <div className="flex items-center space-x-6">
                  <div className={`w-6 h-6 rounded-full border-4 transition-all duration-300 ${formData.role === "USER" ? 'bg-emerald-500 border-emerald-500 scale-110 shadow-emerald-500/50 shadow-lg' : 'border-slate-600/50 group-hover:border-slate-500/70'}`} />
                  <div>
                    <div className="font-bold text-2xl text-slate-100 group-hover:text-emerald-400">Attendee</div>
                    <div className="text-lg text-slate-400 group-hover:text-emerald-300">Book & attend events</div>
                  </div>
                </div>
              </label>
              
              <label className="group relative p-8 bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-md border-2 border-slate-700/50 rounded-3xl cursor-pointer hover:border-purple-500/50 hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300 hover:bg-slate-700/80 focus:outline-none focus:ring-4 focus:ring-purple-500/30">
                <input
                  type="radio"
                  name="role"
                  value="ORGANIZER"
                  checked={formData.role === "ORGANIZER"}
                  onChange={handleChange}
                  className="sr-only"
                  disabled={loading}
                />
                <div className="flex items-center space-x-6">
                  <div className={`w-6 h-6 rounded-full border-4 transition-all duration-300 ${formData.role === "ORGANIZER" ? 'bg-purple-500 border-purple-500 scale-110 shadow-purple-500/50 shadow-lg' : 'border-slate-600/50 group-hover:border-slate-500/70'}`} />
                  <div>
                    <div className="font-bold text-2xl text-slate-100 group-hover:text-purple-400">Organizer</div>
                    <div className="text-lg text-slate-400 group-hover:text-purple-300">Host & manage events</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full px-10 py-7 bg-gradient-to-r from-emerald-600 to-emerald-700 text-xl font-black text-white rounded-3xl shadow-2xl hover:shadow-emerald-500/50 hover:-translate-y-1 transition-all duration-500 overflow-hidden focus:outline-none focus:ring-4 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-lg"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/40 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
            <span className="relative flex items-center justify-center">
              {loading ? (
                <>
                  <svg className="w-6 h-6 mr-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Sign Up Free
                </>
              )}
            </span>
          </button>
        </form>

        {/* Footer */}
        <div className="pt-10 mt-12 border-t border-slate-800/50 text-center">
          <p className="text-lg text-slate-400 mb-4">
            Already have an account?
          </p>
          <Link
            to="/organizer/login"
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-md border-2 border-slate-700/50 text-slate-300 font-bold rounded-3xl hover:from-slate-700/80 hover:to-slate-800/80 hover:border-slate-600/70 hover:text-slate-200 hover:shadow-xl hover:shadow-slate-500/30 hover:-translate-y-1 transition-all duration-300 shadow-lg"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-slate-400/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign In
            </span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        .bg-grid-slate {
          background-image: 
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </div>
  );
}
