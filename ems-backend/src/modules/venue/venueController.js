import { venueService } from "./venueService.js";

export const venueController = {
  async create(req, res, next) {
    try {
      const venue = await venueService.create(req.body, req.user.id);
      res.status(201).json({ success: true, data: venue });
    } catch (e) {
      next(e);
    }
  },

  async list(req, res, next) {
    try {
      const venues = await venueService.getAll(req.user);
      res.json({ success: true, data: venues });
    } catch (e) {
      next(e);
    }
  },

  async getById(req, res, next) {
    try {
      const venue = await venueService.getById(req.params.id, req.user);
      res.json({ success: true, data: venue });
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const venue = await venueService.update(
        req.params.id,
        req.body,
        req.user
      );
      res.json({ success: true, data: venue });
    } catch (e) {
      next(e);
    }
  },

  async remove(req, res, next) {
    try {
      await venueService.remove(req.params.id, req.user);
      res.json({ success: true, message: "Venue deleted" });
    } catch (e) {
      next(e);
    }
  },
};
