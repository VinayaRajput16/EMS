// src/pages/Home.jsx
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 text-white">
      {/* Main Hero */}
      <section className="relative overflow-hidden pt-32 pb-40">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate/[0.1] bg-center [mask-image:radial-gradient(ellipse_80%_50%_at_50%_-20%,white,transparent)]"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-gradient-to-r from-emerald-900/20 to-emerald-800/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gradient-to-l from-rose-900/15 to-rose-800/15 rounded-full blur-2xl animate-pulse delay-1000"></div>

        <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 mb-8 animate-float-slow">
              <svg className="w-5 h-5 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-semibold text-slate-200">Trusted by 50K+ organizers & attendees</span>
            </div>

            {/* Headline */}
            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500 bg-clip-text text-transparent leading-tight mb-8 drop-shadow-2xl">
              Event Management
              <br />
              <span className="bg-gradient-to-r from-rose-500 via-rose-400 to-rose-600 bg-clip-text text-transparent drop-shadow-2xl">
                Mastered
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-2xl lg:text-3xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed opacity-95 drop-shadow-lg">
              Professional ticketing, seating automation, and organizer tools for 
              seamless event experiences in Aurangabad and beyond.
            </p>

            {/* Primary CTA */}
            <div className="flex flex-col lg:flex-row gap-6 justify-center items-center mb-20">
              <a
                href="/events"
                className="group relative px-12 py-7 bg-gradient-to-r from-emerald-600 to-emerald-700 text-xl font-bold text-white rounded-3xl shadow-2xl hover:shadow-emerald-500/25 hover:-translate-y-1 transition-all duration-500 overflow-hidden focus:outline-none focus:ring-4 focus:ring-emerald-400/50 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></span>
                <span className="relative flex items-center">
                  <svg className="w-7 h-7 mr-3 opacity-95" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Explore Events
                </span>
              </a>
              <a
                href="/organizer/login"
                className="px-12 py-7 border-4 border-rose-600 text-xl font-bold text-rose-400 rounded-3xl hover:bg-rose-600 hover:text-white hover:border-rose-700 transition-all duration-300 shadow-xl hover:shadow-rose-500/25 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-rose-500/50 focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                For Organizers
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-12 lg:gap-20 max-w-4xl mx-auto pt-8">
              <div className="text-center p-6 border-r border-slate-800/50 last:border-r-0">
                <div className="text-4xl lg:text-5xl font-black text-emerald-400 mb-3 drop-shadow-lg">500+</div>
                <div className="text-lg font-semibold text-slate-300">Events Hosted</div>
              </div>
              <div className="text-center p-6 border-r border-slate-800/50 last:border-r-0">
                <div className="text-4xl lg:text-5xl font-black text-slate-300 mb-3 drop-shadow-lg">99.9%</div>
                <div className="text-lg font-semibold text-emerald-400">Uptime Guarantee</div>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl lg:text-5xl font-black text-rose-400 mb-3 drop-shadow-lg">24/7</div>
                <div className="text-lg font-semibold text-slate-300">Support</div>
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
