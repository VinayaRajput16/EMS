import { eventRepo } from "./eventRepo.js";
import AppError from "../../common/errors/AppError.js";
import { venueRepo } from "../venue/venueRepo.js";

export const eventService = {
  async create(payload, organizerId) {
    const {
      title,
      description,
      startDateTime,
      endDateTime,
      allocationMode,
    } = payload;

    if (!title || !startDateTime || !endDateTime) {
      throw new AppError("Missing required fields", 400);
    }

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    if (isNaN(start) || isNaN(end)) {
      throw new AppError("Invalid date format", 400);
    }

    if (start >= end) {
      throw new AppError("Start time must be before end time", 400);
    }

    return eventRepo.create({
      title,
      description,
      organizerId,
      status: "DRAFT",
      allocationMode: allocationMode ?? "MANUAL",
      startDateTime: start,
      endDateTime: end,
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
    // 1. Venue assigned
    if (!event.venueLayoutTemplateId) {
      throw new AppError("Venue must be assigned before publishing", 400);
    }

    // 2. Seat categories exist
    const seatCategories = await seatCategoryRepo.findByEvent(eventId);
    if (!seatCategories || seatCategories.length === 0) {
      throw new AppError(
        "Seat categories must be created before publishing",
        400
      );
    }

    // 3. Tickets exist
    const tickets = await ticketRepo.findByEvent(eventId);
    if (!tickets || tickets.length === 0) {
      throw new AppError(
        "At least one ticket must be created before publishing",
        400
      );
    }

    if (!event) {
      throw new AppError("Event not found", 404);
    }

    if (event.organizerId !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    if (event.status !== "DRAFT") {
      throw new AppError("Only draft events can be published", 400);
    }

    // ✅ FIX: check correct field
    if (!event.venueLayoutTemplateId) {
      throw new AppError("Venue must be assigned before publishing", 400);
    }

    return eventRepo.updateById(eventId, {
      status: "PUBLISHED",
    });
  },

  async remove(eventId, organizerId) {
    const event = await eventRepo.findById(eventId);
    if (!event) throw new AppError("Event not found", 404);

    if (event.organizerId !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    return eventRepo.deleteById(eventId);
  },

  async attachVenue(eventId, venueId, organizerId) {
    const event = await eventRepo.findById(eventId);
    if (!event) throw new AppError("Event not found", 404);

    if (event.organizerId !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    if (event.status !== "DRAFT") {
      throw new AppError("Venue can only be set for DRAFT events", 400);
    }

    // ✅ FIX: fetch venue & store layout template, not venueId
    const venue = await venueRepo.findById(venueId);
    if (!venue) {
      throw new AppError("Venue not found", 404);
    }

    return eventRepo.updateById(eventId, {
      venueLayoutTemplateId: venue.layoutTemplateId,
    });
  },

  async getEvent(eventId, organizerId) {
    const event = await eventRepo.findById(eventId);
    if (!event) throw new AppError("Event not found", 404);

    if (event.organizerId !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    return event;
  },
};
