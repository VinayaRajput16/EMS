import AppError from "../../common/errors/AppError.js";
import { layoutRepo } from "./layoutRepo.js";

export const layoutService = {
  async create(payload) {
    const { name, layoutType, schema } = payload;
    if (!name || !layoutType || !schema) {
      throw new AppError("Missing required fields", 400);
    }
    return layoutRepo.create({ name, layoutType, schema });
  },

  async list() {
    return layoutRepo.findAll();
  },

  async get(id) {
    const layout = await layoutRepo.findById(id);
    if (!layout) throw new AppError("Layout not found", 404);
    return layout;
  },

  async update(id, payload) {
    return layoutRepo.updateById(id, payload);
  },

  async remove(id) {
    return layoutRepo.deleteById(id);
  }
};
