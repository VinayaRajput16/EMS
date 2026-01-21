import apiClient from "./axios";

export const eventApi = {
  createEvent: (eventData) => apiClient.post('/events', eventData),
  getEvents: () => apiClient.get('/events/my'),
  getEvent: (id) => apiClient.get(`/events/${id}`),
  attachVenue: (eventId, data) => apiClient.patch(`/events/${eventId}/venue`, data),
  publishEvent: (eventId) => apiClient.patch(`/events/${eventId}/publish`),
  deleteEvent: (id) => apiClient.delete(`/events/${id}`)
};

