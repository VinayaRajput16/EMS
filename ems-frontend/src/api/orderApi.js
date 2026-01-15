import apiClient from './axios.js';

export const orderApi = {
  bookTickets: (orderData) => apiClient.post('/orders', orderData),
  getMyBookings: () => apiClient.get('/my-bookings'),
  getBookingDetails: (id) => apiClient.get(`/orders/${id}`),
  cancelBooking: (id) => apiClient.patch(`/orders/${id}/cancel`)
};
