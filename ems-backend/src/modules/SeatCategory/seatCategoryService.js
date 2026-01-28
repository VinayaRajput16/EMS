import AppError from "../../common/errors/AppError.js";
import { seatCategoryRepo } from "./seatCategoryRepo.js";
import { eventRepo } from "../event/eventRepo.js";

export const seatCategoryService = {
  async create(eventId, payload, organizerId) {
    const { name, priority, maxSeats } = payload;

    if (!name || priority === undefined || !maxSeats) {
      throw new AppError("Missing required fields", 400);
    }

    if (priority <= 0 || maxSeats <= 0) {
      throw new AppError("Priority and maxSeats must be positive", 400);
    }

    const event = await eventRepo.findById(eventId);

    if (!event) {
      throw new AppError("Event not found", 404);
    }

    if (event.organizerId !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    if (event.status !== "DRAFT") {
      throw new AppError(
        "Seat categories cannot be modified after publishing",
        400
      );
    }

    if (!event.venue) {
      throw new AppError(
        "Venue must be created before seat categories",
        400
      );
    }

    const existingCategories =
      await seatCategoryRepo.findByVenue(event.venue.id);

    const totalSeats =
      existingCategories.reduce((sum, c) => sum + (c.maxSeats || 0), 0) +
      maxSeats;

    if (totalSeats > event.venue.capacity) {
      throw new AppError(
        "Total seat categories exceed venue capacity",
        400
      );
    }

    return seatCategoryRepo.create(event.venue.id, {
      name,
      priority,
      maxSeats,
    });
  },

  async list(eventId, organizerId) {
    const event = await eventRepo.findById(eventId);

    if (!event) {
      throw new AppError("Event not found", 404);
    }

    if (event.organizerId !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    if (!event.venue) {
      return [];
    }

    return seatCategoryRepo.findByVenue(event.venue.id);
  },
};
