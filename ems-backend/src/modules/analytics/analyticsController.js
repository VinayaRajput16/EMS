import { analyticsService } from "./analyticsService.js";

export const analyticsController = {
  // ORGANIZER endpoints
  async getOrganizerSalesSummary(req, res, next) {
    try {
      const summary = await analyticsService.getOrganizerSalesSummary(
        req.user.id
      );
      res.json({ success: true, data: summary });
    } catch (e) {
      next(e);
    }
  },

  async getOrganizerEventOrders(req, res, next) {
    try {
      const orders = await analyticsService.getOrganizerEventOrders(
        req.params.eventId,
        req.user.id
      );
      res.json({ success: true, data: orders });
    } catch (e) {
      next(e);
    }
  },

  // ADMIN endpoints
  async getAdminAllEvents(req, res, next) {
    try {
      const events = await analyticsService.getAdminAllEvents();
      res.json({ success: true, data: events });
    } catch (e) {
      next(e);
    }
  },

  async getAdminAllOrders(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const skip = parseInt(req.query.skip) || 0;

      const orders = await analyticsService.getAdminAllOrders(limit, skip);
      res.json({ success: true, data: orders });
    } catch (e) {
      next(e);
    }
  },

  async getAdminEventDetails(req, res, next) {
    try {
      const event = await analyticsService.getAdminEventDetails(
        req.params.eventId
      );
      res.json({ success: true, data: event });
    } catch (e) {
      next(e);
    }
  },

  async blockEvent(req, res, next) {
    try {
      await analyticsService.blockEvent(req.params.eventId);
      res.json({ success: true, message: "Event blocked" });
    } catch (e) {
      next(e);
    }
  },

  async getOrderStats(req, res, next) {
    try {
      const stats = await analyticsService.getOrderStats();
      res.json({ success: true, data: stats });
    } catch (e) {
      next(e);
    }
  },
};
