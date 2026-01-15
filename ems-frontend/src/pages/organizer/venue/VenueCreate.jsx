import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { venueApi } from '../../../api/venueApi';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Card from '../../../components/common/Card';

const VenueCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Frontend validation (matches backend)
    if (!formData.name.trim()) {
      setError('Venue name is required');
      return;
    }
    if (!formData.location.trim()) {
      setError('Location is required');
      return;
    }
    if (!formData.capacity || parseInt(formData.capacity) <= 0) {
      setError('Capacity must be greater than 0');
      return;
    }

    console.log('Creating venue:', formData);
    
    setLoading(true);
    setError('');
    
    try {
      await venueApi.createVenue(formData);
      navigate('/organizer/venues', { replace: true });
    } catch (error) {
      console.error('Venue create error:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to create venue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="p-12 shadow-2xl">
          <button 
            onClick={() => navigate('/organizer/venues')}
            className="mb-8 text-indigo-600 hover:text-indigo-700 font-semibold flex items-center"
          >
            ← Back to Venues
          </button>
          
          <h1 className="text-4xl font-black text-gray-900 mb-8">Create New Venue</h1>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded text-red-800">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Venue Name *"
              placeholder="Convention Center Hall A"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            
            <Input
              label="Location *"
              placeholder="123 Main St, Aurangabad, Maharashtra"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
            
            <Input
              label="Capacity *"
              type="number"
              placeholder="500"
              min="1"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              required
            />
            
            <Button type="submit" size="lg" className="w-full shadow-2xl" loading={loading}>
              Create Venue
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default VenueCreate;
