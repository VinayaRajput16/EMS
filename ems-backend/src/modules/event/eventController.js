import { eventService } from "./eventService.js";

export const eventController = {
  async create(req, res, next) {
    try {
      const event = await eventService.create(
        req.body,
        req.user.id
      );
      res.status(201).json({ success: true, data: event });
    } catch (e) {
      next(e);
    }
  },

  async myEvents(req, res, next) {
    try {
      const events = await eventService.getMyEvents(req.user.id);
      res.json({ success: true, data: events });
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const event = await eventService.update(
        req.params.id,
        req.body,
        req.user.id
      );
      res.json({ success: true, data: event });
    } catch (e) {
      next(e);
    }
  },

  async publish(req, res, next) {
    try {
      const event = await eventService.publish(
        req.params.id,
        req.user.id
      );
      res.json({ success: true, data: event });
    } catch (e) {
      next(e);
    }
  },

  async remove(req, res, next) {
    try {
      await eventService.remove(req.params.id, req.user.id);
      res.json({ success: true, message: "Event deleted" });
    } catch (e) {
      next(e);
    }
  },

  async getEvent(req, res, next) {
    try {
      const event = await eventService.getEvent(
        req.params.id,
        req.user.id
      );
      res.json({ success: true, data: event });
    } catch (e) {
      next(e);
    }
  },
 
  /**
   * Get all published events (public - no auth required)
   */
  async getAllPublished(req, res, next) {
    try {
      const events = await eventService.getAllPublished();
      res.json({ success: true, data: events });
    } catch (e) {
      next(e);
    }
  },

  /**
   * Get public event details with ticket types (public - no auth required)
   */
  async getPublicEventDetails(req, res, next) {
    try {
      const event = await eventService.getPublicEventDetails(req.params.id);
      res.json({ success: true, data: event });
    } catch (e) {
      next(e);
    }
  },
};
