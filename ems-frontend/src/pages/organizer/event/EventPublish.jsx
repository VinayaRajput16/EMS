// src/pages/organizer/event/EventPublish.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventApi } from '../../../api/eventApi';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';

const EventPublish = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [publishChecks, setPublishChecks] = useState({});

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const response = await eventApi.getEvent(eventId);
      setEvent(response.data.data);
      
      // Run publish checks
      setPublishChecks({
        hasVenue: !!response.data.data.venueId,
        hasSeats: false, // Check via API later
        hasTickets: false
      });
    } catch (error) {
      console.error('Load error:', error);
    }
  };

  const handlePublish = async () => {
    setLoading(true);
    try {
      await eventApi.publishEvent(eventId);
      alert('🎉 Event published successfully! Users can now book tickets.');
      navigate('/organizer/events');
    } catch (error) {
      console.error('Publish failed:', error.response?.data);
      alert(error.response?.data?.message || 'Failed to publish event');
    } finally {
      setLoading(false);
    }
  };

  const canPublish = event?.status === 'DRAFT' && publishChecks.hasVenue;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl">
          <div className="p-8">
            <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-emerald-600 bg-clip-text text-transparent mb-8">
              Publish Event
            </h1>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-2xl font-bold mb-6">Event Checklist</h3>
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl border-l-4 ${
                    publishChecks.hasVenue 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-orange-500 bg-orange-50'
                  }`}>
                    <div className="flex items-center">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                        publishChecks.hasVenue ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'
                      }`}>
                        {publishChecks.hasVenue ? '✅' : '⚠️'}
                      </span>
                      <div>
                        <div className="font-semibold">Venue Attached</div>
                        <div className="text-sm text-gray-600">
                          {publishChecks.hasVenue ? event?.venueId : 'Required before publishing'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl border">
                  <h3 className="text-xl font-bold mb-3">Ready to Go Live?</h3>
                  <p className="text-gray-700 mb-4">
                    Once published, users will be able to book tickets for <strong>{event?.title}</strong>.
                  </p>
                  <div className="text-3xl font-black text-emerald-600 mb-2">
                    {event?.venueId ? 'READY TO PUBLISH' : 'ATTACH VENUE FIRST'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handlePublish}
                disabled={!canPublish || loading}
                className={`flex-1 py-6 text-xl font-black rounded-2xl ${
                  canPublish
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 shadow-2xl'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {loading ? 'Publishing...' : '🚀 PUBLISH EVENT LIVE'}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/organizer/events/${eventId}/edit`)}
                className="px-8 py-6 text-lg"
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

export default EventPublish;
