import apiClient from './axios.js';

export const venueApi = {
  createVenue: (venueData) => apiClient.post('/venues', venueData),
  getVenues: () => apiClient.get('/venues'),  // Returns organizer's venues
  getVenueById: (id) => apiClient.get(`/venues/${id}`),
  updateVenue: (id, venueData) => apiClient.patch(`/venues/${id}`, venueData),
  deleteVenue: (id) => apiClient.delete(`/venues/${id}`)
};
