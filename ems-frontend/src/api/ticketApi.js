import apiClient from './axios.js';

export const ticketApi = {
  // Organizer: Create tickets for event
  createTicket: (eventId, ticketData) => apiClient.post(`/events/${eventId}/tickets`, ticketData),
  
  // Public: Get tickets for event (for buying)
  getEventTickets: (eventId) => apiClient.get(`/events/${eventId}/tickets`),
  
  // Organizer: Update/Delete tickets
  updateTicket: (id, ticketData) => apiClient.put(`/tickets/${id}`, ticketData),
  deleteTicket: (id) => apiClient.delete(`/tickets/${id}`)
};
