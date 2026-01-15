// src/pages/organizer/event/EventVenueEditor.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventApi } from '../../../api/eventApi';
import { venueApi } from '../../../api/venueApi';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Card from '../../../components/common/Card';

const EventVenueEditor = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [venues, setVenues] = useState([]);
  const [selectedVenueId, setSelectedVenueId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEventAndVenues();
  }, [eventId]);

  const fetchEventAndVenues = async () => {
    try {
      const [eventRes, venuesRes] = await Promise.all([
        eventApi.getEvent(eventId),
        venueApi.getVenues()
      ]);
      setEvent(eventRes.data.data);
      setVenues(venuesRes.data.data || []);
      setSelectedVenueId(eventRes.data.data.venueId || '');
    } catch (error) {
      console.error('Load error:', error);
    }
  };

  const handleAttachVenue = async () => {
    if (!selectedVenueId) return;
    
    setLoading(true);
    try {
      await eventApi.attachVenue(eventId, { venueId: selectedVenueId });
      alert('✅ Venue attached successfully!');
      navigate(`/organizer/events/${eventId}/edit`); // Back to editor
    } catch (error) {
      console.error('Attach venue failed:', error);
      alert('Failed to attach venue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="shadow-2xl">
          <div className="p-8">
            <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-emerald-600 bg-clip-text text-transparent mb-4">
              Attach Venue to Event
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              <strong>{event?.title}</strong> • {eventId}
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Current Event Status */}
              <div className="space-y-4">
                <div className="p-6 bg-white rounded-2xl shadow-lg border">
                  <h3 className="font-bold text-lg mb-3">Event Status</h3>
                  <div className="space-y-2">
                    <div>Status: <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      event?.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {event?.status || 'DRAFT'}
                    </span></div>
                    <div className={`text-sm font-medium ${event?.venueId ? 'text-emerald-600' : 'text-orange-600'}`}>
                      Venue: {event?.venueId ? '✅ Attached' : '⚠️ Not attached'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Venue Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Select Venue <span className="text-emerald-600">*</span>
                </label>
                <select
                  value={selectedVenueId}
                  onChange={(e) => setSelectedVenueId(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="">Choose a venue...</option>
                  {venues.map(venue => (
                    <option key={venue.id} value={venue.id}>
                      {venue.name} • {venue.location} ({venue.capacity} seats)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-12">
              <Button
                onClick={handleAttachVenue}
                disabled={!selectedVenueId || loading}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 py-4 text-lg font-bold"
              >
                {loading ? 'Attaching...' : '✅ Attach Venue'}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/organizer/events/${eventId}/edit`)}
                className="px-8 py-4"
              >
                ← Back to Editor
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EventVenueEditor;
