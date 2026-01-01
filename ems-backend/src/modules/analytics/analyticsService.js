import { analyticsRepo } from "./analyticsRepo.js";
import { eventRepo } from "../event/eventRepo.js";
import AppError from "../../common/errors/AppError.js";

export const analyticsService = {
  // ORGANIZER: Get sales summary
  async getOrganizerSalesSummary(organizerId) {
    const events = await analyticsRepo.getOrganizerSalesSummary(organizerId);

    // Enrich with computed fields
    return events.map((event) => {
      const ticketStats = event.tickets.map((ticket) => {
        const ticketsSold = ticket.orders.reduce(
          (sum, order) => sum + order.quantity,
          0
        );

        return {
          id: ticket.id,
          name: ticket.name,
          price: ticket.price,
          totalQuantity: ticket.totalQuantity,
          sold: ticketsSold,
          available: ticket.availableQuantity,
          revenue: ticket.price * ticketsSold,
        };
      });

      const totalRevenue = ticketStats.reduce(
        (sum, t) => sum + t.revenue,
        0
      );
      const totalSold = ticketStats.reduce((sum, t) => sum + t.sold, 0);

      return {
        eventId: event.id,
        title: event.title,
        status: event.status,
        createdAt: event.createdAt,
        tickets: ticketStats,
        totalRevenue,
        totalTicketsSold: totalSold,
      };
    });
  },

  // ORGANIZER: Get event orders detail
  async getOrganizerEventOrders(eventId, organizerId) {
    const result = await analyticsRepo.getOrganizerEventOrders(
      eventId,
      organizerId
    );

    if (!result) throw new AppError("Event not found", 404);

    return {
      eventId: result.id,
      eventTitle: result.title,
      orders: result.orders.map((order) => ({
        id: order.id,
        userId: order.userId,
        userName: order.user.name,
        userEmail: order.user.email,
        ticketType: order.ticket.name,
        ticketPrice: order.ticket.price,
        quantity: order.quantity,
        totalAmount: order.ticket.price * order.quantity,
        status: order.status,
        createdAt: order.createdAt,
      })),
      totalOrders: result.orders.length,
    };
  },

  // ADMIN: Get all events
  async getAdminAllEvents() {
    return analyticsRepo.getAllEventsForAdmin();
  },

  // ADMIN: Get all orders (paginated)
  async getAdminAllOrders(limit = 50, skip = 0) {
    return analyticsRepo.getAllOrdersForAdmin(limit, skip);
  },

  // ADMIN: Get event details
  async getAdminEventDetails(eventId) {
    const event = await analyticsRepo.getAdminEventDetails(eventId);
    if (!event) throw new AppError("Event not found", 404);

    return event;
  },

  // ADMIN: Block event
  async blockEvent(eventId) {
    const event = await eventRepo.findById(eventId);
    if (!event) throw new AppError("Event not found", 404);

    return analyticsRepo.blockEvent(eventId);
  },

  // ADMIN: Get order stats
  async getOrderStats() {
    return analyticsRepo.getOrderStats();
  },
};
