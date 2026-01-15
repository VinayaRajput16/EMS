import apiClient from './axios.js';

export const seatManagementApi = {
  getSeatCategories: (eventId) => 
    apiClient.get(`/events/${eventId}/seat-categories`), // TODO: Add backend
  
  getSeatsByEvent: (eventId) => 
    apiClient.get(`/events/${eventId}/seats`),
};
