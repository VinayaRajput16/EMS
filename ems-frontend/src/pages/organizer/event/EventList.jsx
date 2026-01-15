// src/pages/organizer/event/EventList.jsx - FIXED VERSION
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventApi } from '../../../api/eventApi';
import { venueApi } from '../../../api/venueApi';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      console.log('🔄 Fetching events...'); // DEBUG
      const { data } = await eventApi.getEvents(); // ✅ FIXED: getEvents() NOT getMyEvents()
      console.log('📡 Events response:', data); // DEBUG
      setEvents(data.data || []);
    } catch (error) {
      console.error('❌ Events error:', error.response?.data || error.message);
      setEvents([]);
    }
  };

  const fetchVenues = async () => {
    try {
      const { data } = await venueApi.getVenues();
      setVenues(data.data || []);
    } catch (error) {
      console.error('Venues error:', error);
      setVenues([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchEvents(), fetchVenues()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Delete this event?')) {
      try {
        await eventApi.deleteEvent(id); // Keep if exists
        fetchEvents();
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        alert('Delete failed');
      }
    }
  };

  const handleAttachVenue = async (eventId, venueId) => {
    if (!venueId) return;
    try {
      // ✅ FIXED: Correct API signature
      await eventApi.attachVenue(eventId, { venueId });
      fetchEvents();
      alert('✅ Venue attached!');
    } catch (error) {
      alert(error.response?.data?.message || 'Attach failed');
    }
  };

  const handlePublish = async (eventId) => {
    try {
      await eventApi.publishEvent(eventId);
      fetchEvents();
      alert('Event published successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Publish failed');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading your events...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
            Your Events ({events.length})
          </h1>
          {/* ✅ FIXED: Correct route */}
          <Button onClick={() => navigate('/organizer/events/create')} size="lg" className="shadow-xl">
            + New Event
          </Button>
        </div>

        {events.length === 0 ? (
          <Card className="text-center py-24 shadow-2xl">
            <div className="text-6xl mb-8 text-gray-200">📋</div>
            <h2 className="text-3xl font-bold text-gray-700 mb-4">No events yet</h2>
            <p className="text-xl text-gray-500 mb-8">Create your first event to get started!</p>
            <Button size="lg" onClick={() => navigate('/organizer/events/create')}>
              Create First Event
            </Button>
          </Card>
        ) : (
          <Card className="shadow-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                  <th className="p-6 text-left font-bold">Event</th>
                  <th className="p-6 text-left font-bold">Date</th>
                  <th className="p-6 text-left font-bold">Venue</th>
                  <th className="p-6 text-left font-bold">Status</th>
                  <th className="p-6 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b hover:bg-gray-50">
                    <td className="p-6 font-semibold">{event.title}</td>
                    <td className="p-6">
                      {new Date(event.startDateTime).toLocaleDateString()}
                      {' → '}
                      {new Date(event.endDateTime).toLocaleDateString()}
                    </td>
                    <td className="p-6">
                      {event.venueId ? (
                        <span className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-bold">
                          ✅ Attached
                        </span>
                      ) : (
                        <select
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                          onChange={(e) => handleAttachVenue(event.id, e.target.value)}
                          defaultValue=""
                        >
                          <option value="">Select Venue</option>
                          {venues.map((venue) => (
                            <option key={venue.id} value={venue.id}>
                              {venue.name} ({venue.capacity})
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                        event.status === 'PUBLISHED' 
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="p-6 text-right space-x-2">
                      {event.status === 'DRAFT' && !event.venueId && (
                        <span className="text-sm text-gray-500 block mb-2">
                          ⚠️ Attach venue first
                        </span>
                      )}
                      {event.status === 'PUBLISHED' && (
                        <>
                          <Button 
                            size="sm" 
                            className="bg-purple-500 mr-2" 
                            onClick={() => navigate(`/organizer/events/${event.id}/tickets`)}
                          >
                            🎫 Tickets
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-orange-500 mr-2" 
                            onClick={() => navigate(`/organizer/events/${event.id}/seats`)}
                          >
                            🪑 Seats
                          </Button>
                        </>
                      )}
                      {event.status === 'DRAFT' && event.venueId && (
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 mr-2"
                          onClick={() => handlePublish(event.id)}
                        >
                          📢 Publish
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => navigate(`/organizer/events/${event.id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-500 hover:bg-red-600"
                        onClick={() => handleDelete(event.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EventList;
