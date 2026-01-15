// src/pages/organizer/event/EventEditor.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventApi } from '../../../api/eventApi';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';

const EventEditor = () => {
  const { eventId } = useParams();  // ✅ Fixed: useParams()
  const navigate = useNavigate();   // ✅ Fixed: useNavigate()
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ FIXED: Load event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventApi.getEvent(eventId);
        setEvent(response.data.data);
      } catch (error) {
        console.error('Failed to load event:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const steps = [
    { 
      id: 'venue', 
      label: 'Attach Venue', 
      path: `/organizer/events/${eventId}/venue`,
      complete: !!event?.venueId,
      icon: '🏛️'
    },
    { 
      id: 'seats', 
      label: 'Configure Seats', 
      path: `/organizer/events/${eventId}/seats`,
      complete: false,
      icon: '🪑'
    },
    { 
      id: 'tickets', 
      label: 'Add Tickets', 
      path: `/organizer/events/${eventId}/tickets`,
      complete: false,
      icon: '🎫'
    },
    { 
      id: 'publish', 
      label: 'Publish Event', 
      path: `/organizer/events/${eventId}/publish`,
      complete: event?.status === 'PUBLISHED',
      icon: '✅'
    }
  ];

  if (loading) {
    return <div className="p-8">Loading event...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Event Header */}
        <Card className="shadow-2xl">
          <div className="p-8">
            <h1 className="text-4xl font-black text-gray-900 mb-4">
              {event?.title || 'Event Editor'}
            </h1>
            <p className="text-xl text-gray-600">
              Status: <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                event?.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                event?.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {event?.status || 'DRAFT'}
              </span>
            </p>
          </div>
        </Card>

        {/* Progress Steps */}
        <Card className="shadow-xl">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Complete Setup</h2>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center p-4 bg-white rounded-xl border-l-4 border-gray-200 hover:shadow-md transition-all">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mr-4 ${
                    step.complete 
                      ? 'bg-emerald-500 text-white shadow-lg' 
                      : index === 0 
                        ? 'bg-blue-500 text-white shadow-lg' 
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{step.label}</div>
                    <div className="text-sm text-gray-500">
                      {step.complete ? '✅ Complete' : index === 0 ? 'Next Step' : 'Pending'}
                    </div>
                  </div>
                  <Button 
                    onClick={() => navigate(step.path)}
                    className="ml-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-6 py-2"
                  >
                    Go to Step
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(step => (
            <Button 
              key={step.id}
              className={`h-32 rounded-2xl shadow-xl text-left p-6 transform hover:scale-105 transition-all ${
                step.complete 
                  ? 'bg-emerald-500 from-emerald-500 to-emerald-600' 
                  : step.id === 'venue' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                    : 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600'
              }`}
              onClick={() => navigate(step.path)}
              disabled={!step.complete && step.id !== 'venue'}
            >
              <div className="text-3xl mb-3">{step.icon}</div>
              <div className="font-bold text-white">{step.label}</div>
              <div className="text-xs opacity-90 mt-1">
                {step.complete ? '✅ Done' : step.id === 'venue' ? 'Start Here' : 'Locked'}
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventEditor;
