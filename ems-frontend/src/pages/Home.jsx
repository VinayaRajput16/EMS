// src/pages/Home.jsx
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 text-white">
      {/* Main Hero */}
      <section className="relative overflow-hidden pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-24 lg:pb-32">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate/[0.1] bg-center [mask-image:radial-gradient(ellipse_80%_50%_at_50%_-20%,white,transparent)]"></div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-5 sm:left-10 w-40 h-40 sm:w-56 sm:h-56 bg-gradient-to-r from-emerald-900/20 to-emerald-800/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-5 sm:right-10 w-52 h-52 sm:w-72 sm:h-72 bg-gradient-to-l from-rose-900/15 to-rose-800/15 rounded-full blur-2xl animate-pulse"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">

            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 mb-6 sm:mb-8">
              <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-xs sm:text-sm font-semibold text-slate-200">Trusted by 50K+ organizers & attendees</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500 bg-clip-text text-transparent leading-tight mb-5 sm:mb-6 drop-shadow-2xl">
              Event Management
              <br />
              <span className="bg-gradient-to-r from-rose-500 via-rose-400 to-rose-600 bg-clip-text text-transparent">
                Mastered
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
              Professional ticketing, seating automation, and organizer tools for
              seamless event experiences in Aurangabad and beyond.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16 px-4">

              {/* Register Button */}
              <Link
                to="/register"
                className="group relative w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-white to-slate-100 text-sm sm:text-base font-black text-slate-900 rounded-2xl shadow-xl hover:shadow-white/30 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden focus:outline-none focus:ring-4 focus:ring-white/50"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-transparent to-white/20 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <span className="relative flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Sign Up Free
                </span>
              </Link>

              {/* Login Button */}
              <Link
                to="/organizer/login"
                className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 border-2 border-rose-600 text-sm sm:text-base font-bold text-rose-400 rounded-2xl hover:bg-rose-600 hover:text-white hover:border-rose-700 transition-all duration-300 shadow-lg hover:shadow-rose-500/25 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-rose-500/50"
              >
                Login
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 lg:gap-16 max-w-2xl mx-auto pt-6 sm:pt-8 px-2 sm:px-4">
              <div className="text-center p-2 sm:p-4 border-r border-slate-800/50">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-400 mb-1 sm:mb-2">500+</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-300">Events Hosted</div>
              </div>
              <div className="text-center p-2 sm:p-4 border-r border-slate-800/50">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-300 mb-1 sm:mb-2">99.9%</div>
                <div className="text-xs sm:text-sm font-semibold text-emerald-400">Uptime</div>
              </div>
              <div className="text-center p-2 sm:p-4">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-rose-400 mb-1 sm:mb-2">24/7</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-300">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
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