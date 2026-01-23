import api from "./axios";

/**
 * Organizer API
 * Uses existing backend routes with ORGANIZER role enforcement
 */
export const organizerApi = {
  // ===== Venues =====
  getVenues: () => api.get("/api/venues"),
  getVenueById: (id) => api.get(`/api/venues/${id}`),
  createVenue: (data) => api.post("/api/venues", data),

  // ===== Events =====
  getMyEvents: () => api.get("/events/my"),
  getEventById: (id) => api.get(`/events/${id}`),
  createEvent: (data) => api.post("/events", data),
  updateEvent: (id, data) => api.patch(`/events/${id}`, data),
  assignVenueToEvent: (eventId, venueId) =>
    api.patch(`/events/${eventId}/venue`, { venueId }),
  publishEvent: (id) => api.patch(`/events/${id}/publish`),
  deleteEvent: (id) => api.delete(`/events/${id}`),

  // ===== Layout Templates (read-only) =====
  getLayoutTemplates: () => api.get("/admin/layouts"),
  getLayoutTemplateById: (id) => api.get(`/admin/layouts/${id}`),

  // ===== Analytics =====
  getSalesSummary: () => api.get("/analytics/organizer/sales-summary"),
  getEventOrders: (eventId) =>
    api.get(`/analytics/organizer/events/${eventId}/orders`),
 // ===== Seat Categories (VENUE based) =====
getSeatCategoriesByVenue: (venueId) =>
  api.get(`/api/venues/${venueId}/seat-categories`),

createSeatCategoryForVenue: (venueId, data) =>
  api.post(`/api/venues/${venueId}/seat-categories`, data),
// ===== Tickets =====
createTicketType: (eventId, data) =>
  api.post(`/api/events/${eventId}/tickets`, data),

getTicketTypesByEvent: (eventId) =>
  api.get(`/api/events/${eventId}/tickets`),

// UPDATE ticket
updateTicket: (id, data) =>
  api.put(`/api/tickets/${id}`, data),
// DELETE ticket
deleteTicket: (id) =>
  api.delete(`/api/tickets/${id}`)
};