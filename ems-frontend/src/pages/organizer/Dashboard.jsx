import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";

const OrganizerDashboard = () => {
  const { user } = useAuth();

  return (
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
                EventFlow Dashboard
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/organizer/events">
                <Button variant="secondary" size="sm">Events</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          
          {/* Welcome Header */}
          <div className="text-center lg:text-left space-y-6">
            <div className="inline-flex items-center px-5 py-3 bg-emerald-100 rounded-2xl text-emerald-800 text-sm font-semibold max-w-max shadow-lg">
              👋 Welcome back
            </div>
            <div>
              <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
                Hello, {user?.name || "Organizer"}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Manage your events, venues, and tickets with the most powerful event platform.
              </p>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div>
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">⚡</span>
              </div>
              <h2 className="text-3xl font-black text-gray-900">Quick Actions</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              <Link to="/organizer/events" className="group">
                <Card className="h-48 p-8 flex flex-col items-center justify-center text-center backdrop-blur-sm bg-white/70 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 border-white/50">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">📋</span>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-3">Manage Events</h3>
                  <p className="text-gray-600 font-medium">View, edit, publish your events</p>
                </Card>
              </Link>

              <Link to="/organizer/events/create" className="group">
                <Card className="h-48 p-8 flex flex-col items-center justify-center text-center backdrop-blur-sm bg-white/70 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 border-white/50">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-indigo-100 rounded-3xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">➕</span>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-3">Create Event</h3>
                  <p className="text-gray-600 font-medium">Start a new event</p>
                </Card>
              </Link>

              <Link to="/organizer/venues" className="group">
                <Card className="h-48 p-8 flex flex-col items-center justify-center text-center backdrop-blur-sm bg-white/70 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 border-white/50">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-emerald-100 rounded-3xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">🏛️</span>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-3">Venues</h3>
                  <p className="text-gray-600 font-medium">Manage venues & layouts</p>
                </Card>
              </Link>

              <Link to="/organizer/seat" className="group">
                <Card className="h-48 p-8 flex flex-col items-center justify-center text-center backdrop-blur-sm bg-white/70 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 border-white/50">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-purple-100 rounded-3xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">🎟️</span>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-3">Seat Management</h3>
                  <p className="text-gray-600 font-medium">Configure seating</p>
                </Card>
              </Link>

              <Link to="/organizer/tickets" className="group">
                <Card className="h-48 p-8 flex flex-col items-center justify-center text-center backdrop-blur-sm bg-white/70 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 border-white/50">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-orange-100 rounded-3xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">💳</span>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-3">Tickets</h3>
                  <p className="text-gray-600 font-medium">Ticket types & pricing</p>
                </Card>
              </Link>

            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default OrganizerDashboard;
