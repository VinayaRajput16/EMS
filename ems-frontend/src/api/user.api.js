// src/api/user.api.js
import api from "./axios";

/**
 * User API
 * Scope: Public events, bookings, tickets
 */
export const userApi = {
  // ===================== PUBLIC EVENTS =====================
  getAllPublishedEvents: () =>
    api.get("/events/public/all"),

  getEventDetails: (eventId) =>
    api.get(`/events/public/${eventId}`),

  // ===================== BOOKINGS/ORDERS =====================
  createBooking: (data) =>
    api.post("/api/orders", data),

  getMyBookings: () =>
    api.get("/api/my-bookings"),

  getBookingDetails: (orderId) =>
    api.get(`/api/orders/${orderId}`),

  cancelBooking: (orderId) =>
    api.patch(`/api/orders/${orderId}/cancel`),

  // ===================== SEATS =====================
  getAvailableSeats: (eventId) =>
    api.get(`/api/events/${eventId}/available-seats`),
};