import AppError from "../../common/errors/AppError.js";
import { seatCategoryRepo } from "./seatCategoryRepo.js";

export const seatCategoryService = {
  async create(venueId, payload) {
    const { name, priority } = payload;

    if (!name || priority === undefined) {
      throw new AppError("Missing required fields", 400);
    }

    if (priority <= 0) {
      throw new AppError("Priority must be greater than 0", 400);
    }

    return seatCategoryRepo.create(venueId, payload);
  },

  async list(venueId) {
    return seatCategoryRepo.findByVenue(venueId);
  }
};
