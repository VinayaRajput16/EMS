import { venueService } from "./venueService.js";

export const venueController = {
  async createForEvent(req, res, next) {
    try {
      const venue = await venueService.createForEvent(
        req.params.eventId,
        req.body,
        req.user.id
      );
      res.status(201).json({ success: true, data: venue });
    } catch (e) {
      next(e);
    }
  },

  async getByEvent(req, res, next) {
    try {
      const venue = await venueService.getByEvent(
        req.params.eventId,
        req.user.id
      );
      res.json({ success: true, data: venue });
    } catch (e) {
      next(e);
    }
  },
};
