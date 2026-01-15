// src/pages/organizer/OrganizerEvents.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventApi } from '../../api/eventApi';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const OrganizerEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const response = await eventApi.getEvents(); // GET /events/my
      setEvents(response.data.data || []);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">Loading your events...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-emerald-600 bg-clip-text text-transparent">
              My Events
            </h1>
            <p className="text-xl text-gray-600 mt-2">
              {events.length} {events.length === 1 ? 'event' : 'events'}
            </p>
          </div>
          <Button 
            as={Link} 
            to="/organizer/events/create"
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 px-8 py-4 text-lg font-bold shadow-xl"
          >
            + Create New Event
          </Button>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <Card className="shadow-2xl text-center py-20">
            <div className="text-6xl mb-6">🎫</div>
            <h2 className="text-3xl font-bold text-gray-700 mb-4">No events yet</h2>
            <p className="text-xl text-gray-500 mb-8">Create your first event to get started!</p>
            <Button 
              as={Link} 
              to="/organizer/events/create"
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-4 text-lg"
            >
              Create First Event
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <Card key={event.id} className="shadow-xl hover:shadow-2xl transition-all group">
                <div className="p-8">
                  {/* Event Image Placeholder */}
                  <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl mb-6 flex items-center justify-center group-hover:scale-105 transition-transform"></div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 truncate">{event.title}</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm">
                      <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
                      <span>{new Date(event.startDateTime).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <div className="w-3 h-3 bg-orange-400 rounded-full mr-3"></div>
                      <span>{new Date(event.endDateTime).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold mb-6 ${
                    event.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                    event.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status}
                  </div>

                  {/* Venue Status */}
                  <div className="mb-6 p-3 bg-gray-50 rounded-xl">
                    <div className="text-sm text-gray-600">Venue</div>
                    <div className={`text-sm font-medium ${
                      event.venueId ? 'text-emerald-600' : 'text-orange-600'
                    }`}>
                      {event.venueId ? '✅ Attached' : '⚠️ Pending'}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      as={Link}
                      to={`/organizer/events/${event.id}/edit`}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 py-3"
                      size="sm"
                    >
                      Edit Event
                    </Button>
                    {event.status === 'DRAFT' && (
                      <Button
                        variant="outline"
                        className="flex-1 border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 py-3"
                        size="sm"
                      >
                        Continue Setup
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerEvents;
