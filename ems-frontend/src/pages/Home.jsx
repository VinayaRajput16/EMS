// src/pages/Home.jsx - OPTIMIZED SIZING
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 text-white">
      {/* Main Hero */}
      <section className="relative overflow-hidden pt-16 sm:pt-24 lg:pt-32 pb-20 sm:pb-32 lg:pb-40">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate/[0.1] bg-center [mask-image:radial-gradient(ellipse_80%_50%_at_50%_-20%,white,transparent)]"></div>
        
        {/* Floating Elements - Responsive sizes */}
        <div className="absolute top-1/4 left-5 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-gradient-to-r from-emerald-900/20 to-emerald-800/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-5 sm:right-10 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-l from-rose-900/15 to-rose-800/15 rounded-full blur-2xl animate-pulse"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl border border-white/20 mb-6 sm:mb-8">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-xs sm:text-sm font-semibold text-slate-200">Trusted by 50K+ organizers & attendees</span>
            </div>

            {/* Headline - Responsive text sizes */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500 bg-clip-text text-transparent leading-tight mb-6 sm:mb-8 drop-shadow-2xl">
              Event Management
              <br />
              <span className="bg-gradient-to-r from-rose-500 via-rose-400 to-rose-600 bg-clip-text text-transparent">
                Mastered
              </span>
            </h1>

            {/* Subtitle - Responsive */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-slate-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
              Professional ticketing, seating automation, and organizer tools for 
              seamless event experiences in Aurangabad and beyond.
            </p>

            {/* Primary CTA - Responsive buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-20 px-4">
              
              {/* Register Button */}
              <Link
                to="/register"
                className="group relative w-full sm:w-auto px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-7 bg-gradient-to-r from-white to-slate-100 text-base sm:text-lg lg:text-xl font-black text-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl hover:shadow-white/50 hover:-translate-y-1 transition-all duration-500 overflow-hidden focus:outline-none focus:ring-4 focus:ring-white/50"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-transparent to-white/20 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <span className="relative flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Sign Up Free
                </span>
              </Link>

              {/* Login Button */}
              <Link
                to="/organizer/login"
                className="w-full sm:w-auto px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-7 border-2 sm:border-4 border-rose-600 text-base sm:text-lg lg:text-xl font-bold text-rose-400 rounded-2xl sm:rounded-3xl hover:bg-rose-600 hover:text-white hover:border-rose-700 transition-all duration-300 shadow-xl hover:shadow-rose-500/25 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-rose-500/50"
              >
                Login
              </Link>
            </div>

            {/* Trust Indicators - Responsive grid */}
            <div className="grid grid-cols-3 gap-6 sm:gap-12 lg:gap-20 max-w-4xl mx-auto pt-6 sm:pt-8 px-2 sm:px-4">
              <div className="text-center p-3 sm:p-6 border-r border-slate-800/50 last:border-r-0">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-emerald-400 mb-2 sm:mb-3 drop-shadow-lg">500+</div>
                <div className="text-xs sm:text-sm lg:text-lg font-semibold text-slate-300">Events Hosted</div>
              </div>
              <div className="text-center p-3 sm:p-6 border-r border-slate-800/50 last:border-r-0">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-300 mb-2 sm:mb-3 drop-shadow-lg">99.9%</div>
                <div className="text-xs sm:text-sm lg:text-lg font-semibold text-emerald-400">Uptime</div>
              </div>
              <div className="text-center p-3 sm:p-6">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-rose-400 mb-2 sm:mb-3 drop-shadow-lg">24/7</div>
                <div className="text-xs sm:text-sm lg:text-lg font-semibold text-slate-300">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

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