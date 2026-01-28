import { seatCategoryService } from "./seatCategoryService.js";

export const seatCategoryController = {
  async create(req, res, next) {
    try {
      const category = await seatCategoryService.create(
        req.params.eventId,
        req.body,
        req.user.id
      );
      res.status(201).json({ success: true, data: category });
    } catch (e) {
      next(e);
    }
  },

  async list(req, res, next) {
    try {
      const categories = await seatCategoryService.list(
        req.params.eventId,
        req.user.id
      );
      res.json({ success: true, data: categories });
    } catch (e) {
      next(e);
    }
  },
};
