import { eventRepo } from "./eventRepo.js";
import AppError from "../../common/errors/AppError.js";

export const eventService = {
  async createEvent(payload, organizerId) {
    const { title, startDateTime, endDateTime } = payload;

    if (!title || !startDateTime || !endDateTime) {
      throw new AppError("Missing required event fields", 400);
    }

    if (new Date(startDateTime) >= new Date(endDateTime)) {
      throw new AppError("Event start time must be before end time", 400);
    }

    return eventRepo.create({
      ...payload,
      organizerId,
      status: "DRAFT",
    });
  },

  async updateEvent(eventId, payload, organizerId) {
    const event = await eventRepo.findById(eventId);

    if (!event) {
      throw new AppError("Event not found", 404);
    }

    if (event.organizerId !== organizerId) {
      throw new AppError("Unauthorized to modify this event", 403);
    }

    if (event.status === "CANCELLED") {
      throw new AppError("Cancelled events cannot be modified", 400);
    }

    return eventRepo.updateById(eventId, payload);
  },

  async publishEvent(eventId, organizerId) {
    const event = await eventRepo.findById(eventId);

    if (!event) {
      throw new AppError("Event not found", 404);
    }

    if (event.organizerId !== organizerId) {
      throw new AppError("Unauthorized to publish this event", 403);
    }

    if (event.status !== "DRAFT") {
      throw new AppError("Only draft events can be published", 400);
    }

    return eventRepo.updateById(eventId, {
      status: "PUBLISHED",
    });
  },

  async getOrganizerEvents(organizerId) {
    return eventRepo.findByOrganizer(organizerId);
  },
};
