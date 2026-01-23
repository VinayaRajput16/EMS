import { layoutService } from "./layoutService.js";

export const layoutController = {
  async create(req, res, next) {
    try {
      const layout = await layoutService.create(req.body);
      res.status(201).json({ success: true, data: layout });
    } catch (e) {
      next(e);
    }
  },

  async list(req, res, next) {
    try {
      const layouts = await layoutService.list();
      res.json({ success: true, data: layouts });
    } catch (e) {
      next(e);
    }
  },

  async get(req, res, next) {
    try {
      const layout = await layoutService.get(req.params.id);
      res.json({ success: true, data: layout });
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const layout = await layoutService.update(req.params.id, req.body);
      res.json({ success: true, data: layout });
    } catch (e) {
      next(e);
    }
  },

  async remove(req, res, next) {
    try {
      await layoutService.remove(req.params.id);
      res.json({ success: true });
    } catch (e) {
      next(e);
    }
  }
};
