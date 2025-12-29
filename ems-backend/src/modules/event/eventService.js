import { eventRepo } from "./eventRepo.js";
import AppError from "../../common/errors/AppError.js";

export const eventService = {
  async create(payload, organizerId) {
    const { title, startDateTime, endDateTime } = payload;

    if (!title || !startDateTime || !endDateTime) {
      throw new AppError("Missing required fields", 400);
    }

    if (new Date(startDateTime) >= new Date(endDateTime)) {
      throw new AppError("Start time must be before end time", 400);
    }

    return eventRepo.create({
      ...payload,
      organizerId,
      status: "DRAFT"
    });
  },

  async getMyEvents(organizerId) {
    return eventRepo.findByOrganizer(organizerId);
  },

  async update(eventId, payload, organizerId) {
    const event = await eventRepo.findById(eventId);
    if (!event) throw new AppError("Event not found", 404);

    if (event.organizerId !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    if (event.status === "PUBLISHED") {
      throw new AppError("Published events cannot be edited", 400);
    }

    return eventRepo.updateById(eventId, payload);
  },

  async publish(eventId, organizerId) {
    const event = await eventRepo.findById(eventId);
    if (!event) throw new AppError("Event not found", 404);

    if (event.organizerId !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    if (event.status !== "DRAFT") {
      throw new AppError("Only draft events can be published", 400);
    }

    return eventRepo.updateById(eventId, { status: "PUBLISHED" });
  },

  async remove(eventId, organizerId) {
    const event = await eventRepo.findById(eventId);
    if (!event) throw new AppError("Event not found", 404);

    if (event.organizerId !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    return eventRepo.deleteById(eventId);
  }
};
