import AppError from "../../common/errors/AppError.js";
import { venueRepo } from "./venueRepo.js";
import { eventRepo } from "../event/eventRepo.js";
import { validateLayoutConfig } from "../../config/validateLayoutConfig.js";

export const venueService = {
  async createForEvent(eventId, payload, organizerId) {
    const event = await eventRepo.findById(eventId);

    if (!event) {
      throw new AppError("Event not found", 404);
    }

    if (event.organizerId !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    if (event.venue) {
      throw new AppError(
        "Venue already exists for this event",
        400
      );
    }

    const { name, location, layoutType, layoutConfig } = payload;

    if (!name || !location || !layoutType || !layoutConfig) {
      throw new AppError("Missing required fields", 400);
    }

    validateLayoutConfig(layoutType, layoutConfig);

    let capacity;
    switch (layoutType) {
      case "ROW_COLUMN":
      case "GALLERY":
        capacity = layoutConfig.rows * layoutConfig.columns;
        break;

      case "ROUND_TABLE":
        capacity = layoutConfig.tables * layoutConfig.seatsPerTable;
        break;

      case "OPEN_CROWD":
        capacity = layoutConfig.capacity;
        break;
    }

    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new AppError("Invalid venue capacity", 400);
    }

    return venueRepo.create({
      eventId,
      name,
      location,
      layoutType,
      layoutConfig,
      capacity,
    });
  },

  async getByEvent(eventId, organizerId) {
    const event = await eventRepo.findById(eventId);

    if (!event) {
      throw new AppError("Event not found", 404);
    }

    if (event.organizerId !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    return venueRepo.findByEventId(eventId);
  },
};
