import apiClient from './axios.js';

export const seatApi = {
  // POST /events/:eventId/tickets/issue
  issueTicket: (eventId, ticketData) => 
    apiClient.post(`/events/${eventId}/tickets/issue`, ticketData),
  
  // POST /issued-tickets/:id/assign-seat  
  assignSeat: (issuedTicketId, seatId) => 
    apiClient.post(`/issued-tickets/${issuedTicketId}/assign-seat`, { seatId }),
};
