// src/pages/organizer/event/EventCreate.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventApi } from '../../../api/eventApi';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Card from '../../../components/common/Card';

const EventCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    // ✅ NO venueId - Backend handles default
    startDateTime: '',
    endDateTime: '',
    status: 'DRAFT',
    allocationMode: 'MANUAL'
  });

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('🚀 Creating event:', formData);
  
  setLoading(true);
  try {
    const response = await eventApi.createEvent(formData);
    const newEventId = response.data.data.id; // Get created event ID
    
    // ✅ REDIRECT TO EVENT EDITOR DASHBOARD
    navigate(`/organizer/events/${newEventId}`);
  } catch (error) {
    console.error('Event creation failed:', error.response?.data);
    alert('Failed to create event');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-2xl">
          <div className="p-8">
            <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent mb-8">
              Create New Event ✨
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Event Title *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Summer Music Festival"
                required
              />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Event details..."
                />
              </div>

              {/* ✅ NO VENUE FIELD - Backend default */}
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl text-sm">
                <strong>🎯 Venue:</strong> Auto-assigned by backend
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Start Date & Time *"
                  type="datetime-local"
                  value={formData.startDateTime}
                  onChange={(e) => setFormData({ ...formData, startDateTime: e.target.value })}
                  required
                />
                <Input
                  label="End Date & Time *"
                  type="datetime-local"
                  value={formData.endDateTime}
                  onChange={(e) => setFormData({ ...formData, endDateTime: e.target.value })}
                  required
                />
              </div>

              {/* ✅ BUTTON ALWAYS CLICKABLE */}
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-4 text-lg"
              >
                {loading ? '🎯 Creating...' : '🚀 Create Event'}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EventCreate;
