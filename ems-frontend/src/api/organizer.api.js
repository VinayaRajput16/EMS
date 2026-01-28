import api from "./axios";

/**
 * Organizer API
 * Scope: Events → Venue → Seat Categories → Tickets
 * Matches app.js routing exactly
 */
export const organizerApi = {
  // ===================== EVENTS =====================
  getMyEvents: () =>
    api.get("/events/my"),

  getEventById: (eventId) =>
    api.get(`/events/${eventId}`),

  createEvent: (data) =>
    api.post("/events", data),

  updateEvent: (eventId, data) =>
    api.patch(`/events/${eventId}`, data),

  publishEvent: (eventId) =>
    api.patch(`/events/${eventId}/publish`),

  deleteEvent: (eventId) =>
    api.delete(`/events/${eventId}`),

  // ===================== VENUE =====================
  // ===== VENUE (EVENT OWNED) =====
  getVenueByEvent: (eventId) =>
    api.get(`/api/events/${eventId}/venue`),

  createVenueForEvent: (eventId, data) =>
    api.post(`/api/events/${eventId}/venue`, data),

  updateVenueForEvent: (eventId, data) =>
    api.patch(`/api/events/${eventId}/venue`, data),


  // ===================== SEAT CATEGORIES =====================
  createSeatCategoryForEvent: (eventId, data) =>
    api.post(`/api/events/${eventId}/seat-categories`, data),

  getSeatCategoriesByEvent: (eventId) =>
    api.get(`/api/events/${eventId}/seat-categories`),

  updateSeatCategory: (categoryId, data) =>
    api.patch(`/api/seat-categories/${categoryId}`, data),

  deleteSeatCategory: (categoryId) =>
    api.delete(`/api/seat-categories/${categoryId}`),

  // ===================== TICKETS =====================
  getTicketsByEvent: (eventId) =>
    api.get(`/api/events/${eventId}/tickets`),

  createTicket: (eventId, data) =>
    api.post(`/api/events/${eventId}/tickets`, data),

  updateTicket: (ticketId, data) =>
    api.put(`/api/tickets/${ticketId}`, data),

  deleteTicket: (ticketId) =>
    api.delete(`/api/tickets/${ticketId}`),
};
