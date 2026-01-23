import AppError from "../../common/errors/AppError.js";
import { venueRepo } from "./venueRepo.js";
import { validateLayoutConfig } from "../../common/utils/validateLayoutConfig.js";
import { layoutService } from "../layout/layoutService.js";
export const venueService = {
  async create(payload, organizerId) {
    const { name, location, capacity, layoutTemplateId, layoutConfig } = payload;

    if (!name || !location || !layoutTemplateId || !layoutConfig) {
      throw new AppError("Missing required fields", 400);
    }

    if (capacity <= 0) {
      throw new AppError("Capacity must be greater than 0", 400);
    }

    const template = await layoutService.get(layoutTemplateId);
    if (!template) {
      throw new AppError("Venue not found", 404);
    }

    validateLayoutConfig(template.schema, layoutConfig);

    return venueRepo.create({
      name,
      location,
      capacity,
      organizerId,
      layoutTemplateId,
      layoutConfig
    });
  },

  async getAll() {
    return venueRepo.findAll();
  },

  async getById(id) {
    const venue = await venueRepo.findById(id);
    if (!venue) throw new AppError("Layout not found", 404);
    return venue;
  },

  async update(id, payload) {
    const venue = await venueRepo.findById(id);
    if (!venue) throw new AppError("Layout not found", 404);

    const updateData = {};
    if (payload.layoutConfig !== undefined) {
      throw new AppError(
        "Layout configuration cannot be updated after venue creation",
        400
      );
    }
    if (payload.name !== undefined) updateData.name = payload.name;
    if (payload.capacity !== undefined) {
      if (payload.capacity <= 0) {
        throw new AppError("Capacity must be greater than 0", 400);
      }
      updateData.capacity = payload.capacity;
    }

    return venueRepo.updateById(id, updateData);
  },

  async remove(id) {
    const venue = await venueRepo.findById(id);
    if (!venue) throw new AppError("Layout not found", 404);

    const linkedPublished = await venueRepo.countPublishedEventsUsingVenue(id);
    if (linkedPublished > 0) {
      throw new AppError(
        "Cannot delete layout linked to published events",
        400
      );
    }

    await venueRepo.deleteById(id);
  },
};
