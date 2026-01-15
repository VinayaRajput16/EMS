import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useNavigate } from 'react-router-dom';

const OrganizerDashboard = () => {
  const navigate = useNavigate();  // ✅ NAVIGATION HOOK

  const handleCreateEvent = () => {
   navigate('/organizer/events/create'); // ✅ GO TO CREATE EVENT
  }; return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-emerald-50 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <Card className="p-8 mb-12 shadow-2xl border-0 bg-gradient-to-r from-indigo-600/10 to-emerald-600/10 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
            <div>
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent mb-4">
                Welcome Back
              </h1>
              <p className="text-xl text-gray-700 font-semibold">Manage your events and grow your business</p>
            </div>
            <Button size="lg" className="whitespace-nowrap shadow-2xl" onClick={handleCreateEvent}>
              + Create New Event
            </Button>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { title: 'Draft Events', value: '3', color: 'from-indigo-500 to-blue-600', icon: '✨' },
            { title: 'Published', value: '7', color: 'from-emerald-500 to-green-600', icon: '✅' },
            { title: 'Total Revenue', value: '₹1.2M', color: 'from-amber-500 to-orange-600', icon: '💰' },
            { title: 'Tickets Sold', value: '2.4K', color: 'from-purple-500 to-pink-600', icon: '🎫' }
          ].map((stat, i) => (
            <Card key={i} className="p-8 group hover:shadow-2xl overflow-hidden relative">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 -mr-16 -mt-16 rounded-3xl`} />
              <div className="relative z-10 flex items-center justify-between mb-6">
                <span className="text-3xl">{stat.icon}</span>
                <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full animate-pulse" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-2">{stat.value}</h3>
              <p className="text-gray-600 font-semibold">{stat.title}</p>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
              Recent Events
            </h3>
            <div className="space-y-4">
              {['TechFest 2026', 'Music Night', 'Startup Summit'].map((event, i) => (
                <div key={i} className="flex items-center p-6 bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-2xl hover:shadow-md transition-all group">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mr-6">
                    <span className="text-white font-bold text-lg">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{event}</h4>
                    <p className="text-sm text-gray-500">Draft • Mar 15, 2026</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button size="sm" variant="secondary" className="px-4">Edit</Button>
                    <Button size="sm" className="px-4">Publish</Button>
                    <Button onClick={() => navigate('/user/bookings')}>
                      My Bookings (User View)
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-2xl font-bold mb-8 bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
              Quick Actions
            </h3>
            <div className="space-y-4">
              {['New Event', 'Manage Venues', 'View Orders'].map((action, i) => (
                <Button key={i} variant="outline" size="md" className="w-full justify-center backdrop-blur-sm">
                  {action}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default OrganizerDashboard;
