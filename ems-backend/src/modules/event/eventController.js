import { eventService } from "./eventService.js";

export const eventController = {
  async createEvent(req, res, next) {
    try {
      const organizerId = req.user.id;

      const event = await eventService.createEvent(
        req.body,
        organizerId
      );

      res.status(201).json({
        success: true,
        data: event,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateEvent(req, res, next) {
    try {
      const organizerId = req.user.id;
      const { id } = req.params;

      const event = await eventService.updateEvent(
        id,
        req.body,
        organizerId
      );

      res.json({
        success: true,
        data: event,
      });
    } catch (error) {
      next(error);
    }
  },

  async publishEvent(req, res, next) {
    try {
      const organizerId = req.user.id;
      const { id } = req.params;

      const event = await eventService.publishEvent(
        id,
        organizerId
      );

      res.json({
        success: true,
        data: event,
      });
    } catch (error) {
      next(error);
    }
  },

  async getMyEvents(req, res, next) {
    try {
      const organizerId = req.user.id;

      const events = await eventService.getOrganizerEvents(
        organizerId
      );

      res.json({
        success: true,
        data: events,
      });
    } catch (error) {
      next(error);
    }
  },
};
