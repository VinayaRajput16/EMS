// src/pages/organizer/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../../api/auth.api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await authApi.login({ email, password });
      
      // Store tokens
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      
      // Get user role and id from response
      const userRole = response.data.user.role;
      const userId = response.data.user.id;
      
      // Redirect based on role
      if (userRole === "ORGANIZER") {
        navigate("/organizer/dashboard");
      } else if (userRole === "USER") {
        navigate(`/user/${userId}/dashboard`);
      } else {
        setError("Unknown user role. Please contact support.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 text-white flex items-center justify-center p-6 lg:p-12">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-gradient-to-r from-emerald-900/20 to-emerald-800/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gradient-to-l from-rose-900/15 to-rose-800/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-grid-slate/[0.08] bg-center [mask-image:radial-gradient(ellipse_80%_50%_at_50%_-20%,white,transparent)]"></div>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md lg:max-w-lg bg-white/5 backdrop-blur-3xl rounded-4xl border border-white/10 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-10 lg:p-12 text-center border-b border-slate-800/50">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl border-4 border-white/20">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-slate-100 via-emerald-400 to-emerald-500 bg-clip-text text-transparent tracking-tight mb-4">
            Welcome Back
          </h2>
          <p className="text-xl text-slate-400 font-semibold max-w-sm mx-auto">
            Sign in to continue
          </p>
        </div>

        {/* Form Content */}
        <div className="p-10 lg:p-12 space-y-8">
          <form onSubmit={submit} className="space-y-8" noValidate>
            
            {/* Error Message */}
            {error && (
              <div className="bg-rose-500/10 backdrop-blur-sm border border-rose-500/40 rounded-3xl p-6 flex items-center space-x-4 animate-pulse">
                <svg className="w-6 h-6 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-rose-300 font-medium flex-1">{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-3">
              <label htmlFor="email" className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center">
                <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.27 5.05c.4.28.94.28 1.34 0L21 8M5.02 17h13.96a2 2 0 002-2V9a2 2 0 00-2-2H5.02a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9z" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full pl-14 pr-6 py-5 bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-md border-2 border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-500 focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500/70 transition-all duration-300 font-semibold shadow-lg hover:shadow-emerald-500/20 outline-none disabled:opacity-60"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e=>setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <label htmlFor="password" className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center">
                <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="w-full pl-14 pr-6 py-5 bg-gradient-to-r from-slate-800/95 to-slate-900/95 backdrop-blur-md border-2 border-slate-700/50 rounded-2xl text-slate-100 placeholder-slate-500 focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500/70 transition-all duration-300 font-semibold shadow-lg hover:shadow-emerald-500/20 outline-none disabled:opacity-60"
                  placeholder="••••••••"
                  value={password}
                  onChange={e=>setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex items-center justify-center py-6 px-8 text-xl font-black rounded-3xl shadow-2xl transition-all duration-500 overflow-hidden focus:outline-none focus:ring-4 focus:ring-emerald-500/50 focus:ring-offset-2 focus:ring-offset-transparent ${
                isLoading
                  ? 'bg-slate-800/50 border-2 border-slate-700/50 cursor-not-allowed text-slate-500 shadow-lg'
                  : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white hover:shadow-emerald-500/50 hover:-translate-y-1'
              }`}
            >
              <span className={`absolute inset-0 bg-gradient-to-r from-emerald-400/40 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out ${isLoading ? 'opacity-0' : ''}`} />
              <span className="relative flex items-center">
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-4 h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg className="w-7 h-7 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign In Securely
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800/50" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-6 bg-slate-900/50 py-2 text-slate-500 backdrop-blur-sm rounded-full border border-slate-800/50">
                New here?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <Link
              to="/register"
              className="group inline-flex items-center px-10 py-5 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-md border-2 border-slate-700/50 text-slate-300 font-bold rounded-3xl hover:from-slate-700/80 hover:to-slate-800/80 hover:border-slate-600/70 hover:text-slate-200 hover:shadow-xl hover:shadow-slate-500/30 hover:-translate-y-1 transition-all duration-300 shadow-lg w-full justify-center"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-slate-400/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative flex items-center">
                <svg className="w-6 h-6 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Create Account
              </span>
            </Link>
          </div>
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
      `}</style>
    </div>
  );
}