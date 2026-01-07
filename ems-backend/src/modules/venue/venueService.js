import AppError from "../../common/errors/AppError.js";
import { venueRepo } from "./venueRepo.js";

export const venueService = {
  async create(payload, organizerId) {
    const { name, location, capacity } = payload;

    if (!name || !location || capacity === undefined) {
      throw new AppError("Missing required fields", 400);
    }

    if (capacity <= 0) {
      throw new AppError("Capacity must be greater than 0", 400);
    }

    return venueRepo.create({
      name,
      location,
      capacity,
      organizerId,
    });
  },

  async getAll(user) {
    if (user.role === "ADMIN") {
      return venueRepo.findAll();
    }

    // USER and ORGANIZER both get read-only list
    if (user.role === "ORGANIZER") {
      return venueRepo.findByOrganizer(user.id);
    }

    // Normal user: see all venues (read-only)
    return venueRepo.findAll();
  },

  async getById(id, user) {
    const venue = await venueRepo.findById(id);
    if (!venue) throw new AppError("Venue not found", 404);

    // Everyone can read single venue
    return venue;
  },

  async update(id, payload, user) {
    const venue = await venueRepo.findById(id);
    if (!venue) throw new AppError("Venue not found", 404);

    if (user.role !== "ORGANIZER") {
      throw new AppError("Unauthorized", 403);
    }

    if (venue.organizerId !== user.id) {
      throw new AppError("Unauthorized", 403);
    }

    const updateData = {};

    if (payload.name !== undefined) updateData.name = payload.name;
    if (payload.location !== undefined) updateData.location = payload.location;

    if (payload.capacity !== undefined) {
      if (payload.capacity <= 0) {
        throw new AppError("Capacity must be greater than 0", 400);
      }
      updateData.capacity = payload.capacity;
    }

    return venueRepo.updateById(id, updateData);
  },

  async remove(id, user) {
    const venue = await venueRepo.findById(id);
    if (!venue) throw new AppError("Venue not found", 404);

    if (user.role !== "ORGANIZER") {
      throw new AppError("Unauthorized", 403);
    }

    if (venue.organizerId !== user.id) {
      throw new AppError("Unauthorized", 403);
    }

    const linkedPublished = await venueRepo.countPublishedEventsUsingVenue(id);
    if (linkedPublished > 0) {
      throw new AppError(
        "Cannot delete venue linked to published events",
        400
      );
    }

    await venueRepo.deleteById(id);
  },
};
