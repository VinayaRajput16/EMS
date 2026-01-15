import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const Home = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
    {/* Top Navigation */}
    <nav className="backdrop-blur-md bg-white/80 border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">E</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
              EventFlow
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="secondary" size="sm">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>

    {/* Hero Section */}
    <section className="pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 lg:pr-16">
          <div className="inline-flex items-center px-5 py-3 bg-emerald-100 rounded-2xl text-emerald-800 text-sm font-semibold max-w-max shadow-lg">
            🚀 Trusted by 10K+ organizers
          </div>
          
          <div>
            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-tight mb-6">
              Create Events 
              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                That Sell Out
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              Professional event management platform built for speed, scale, and stunning attendee experiences.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register">
              <Button size="lg" className="shadow-2xl px-10 py-6 text-lg">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="px-10 py-6">
                View Demo
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-8 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center shadow-md">
                <span className="text-emerald-600 font-bold text-lg">500+</span>
              </div>
              <span>Organizers</span>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center shadow-md">
                <span className="text-indigo-600 font-bold text-lg">50K+</span>
              </div>
              <span>Tickets</span>
            </div>
          </div>
        </div>
        
        <div className="relative group">
          <Card className="shadow-2xl border-0 h-[600px] p-12 flex items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50/50 to-emerald-50" />
            <div className="relative z-10 w-full h-96 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-emerald-500/10 rounded-3xl border-4 border-white/60 shadow-2xl transform group-hover:scale-105 transition-all duration-500" />
            <div className="absolute top-12 left-12 w-24 h-24 bg-indigo-500/20 rounded-2xl blur-xl animate-pulse" />
            <div className="absolute bottom-12 right-12 w-20 h-20 bg-emerald-500/20 rounded-xl animate-bounce" />
          </Card>
        </div>
      </div>
    </section>
  </div>
);

export default Home;
