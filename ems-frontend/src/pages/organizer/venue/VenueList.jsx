import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { venueApi } from '../../../api/venueApi';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';

const VenueList = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const { data } = await venueApi.getVenues();
      setVenues(data.data || []);
    } catch (error) {
      console.error('Fetch venues error:', error);
      setVenues([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this venue? This cannot be undone.')) {
      try {
        await venueApi.deleteVenue(id);
        fetchVenues();
      } catch (error) {
        alert('Delete failed: ' + (error.response?.data?.message || 'Unknown error'));
      }
    }
  };

  if (loading) return <div className="p-8 text-center">Loading venues...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-indigo-900 bg-clip-text text-transparent">
            Your Venues ({venues.length})
          </h1>
          <Button 
            size="lg" 
            className="shadow-xl"
            onClick={() => navigate('/organizer/venue-create')}
          >
            + New Venue
          </Button>
        </div>

        {venues.length === 0 ? (
          <Card className="text-center py-24 shadow-2xl">
            <div className="text-6xl mb-8 text-gray-200">🏛️</div>
            <h2 className="text-2xl font-bold mb-4">No venues created</h2>
            <p className="text-gray-600 mb-8">Create venues to host your events!</p>
            <Button 
              size="lg"
              className="shadow-xl"
              onClick={() => navigate('/organizer/venue-create')}
            >
              Create First Venue
            </Button>
          </Card>
        ) : (
          <Card className="shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <th className="p-6 text-left font-bold">Venue Name</th>
                    <th className="p-6 text-left font-bold">Location</th>
                    <th className="p-6 text-left font-bold">Capacity</th>
                    <th className="p-6 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {venues.map((venue) => (
                    <tr key={venue.id} className="border-b hover:bg-gray-50">
                      <td className="p-6 font-semibold">{venue.name}</td>
                      <td className="p-6 text-gray-700">{venue.location}</td>
                      <td className="p-6 font-bold text-indigo-600">{venue.capacity.toLocaleString()}</td>
                      <td className="p-6 text-right space-x-2">
                        <Button size="sm" variant="secondary">Edit</Button>
                        <Button 
                          size="sm" 
                          className="bg-red-500 hover:bg-red-600"
                          onClick={() => handleDelete(venue.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VenueList;
