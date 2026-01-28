import { eventRepo } from "./eventRepo.js";
import AppError from "../../common/errors/AppError.js";
import { seatCategoryRepo } from "../seatCategory/seatCategoryRepo.js";
import prisma from "../../config/db.js";


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

    if (!event) {
      throw new AppError("Event not found", 404);
    }

    if (event.organizerId !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    if (event.status !== "DRAFT") {
      throw new AppError("Only draft events can be published", 400);
    }

    // 1️⃣ Venue must exist (event-owned)
    if (!event.venue) {
      throw new AppError("Venue must be created before publishing", 400);
    }

    // 2️⃣ Seat categories must exist
    const seatCategories = await seatCategoryRepo.findByVenue(
      event.venue.id
    );

    if (!seatCategories.length) {
      throw new AppError(
        "Seat categories must be created before publishing",
        400
      );
    }

    const ticketTypes = await prisma.ticketType.findMany({
      where: { eventId },
    });

    if (!ticketTypes.length) {
      throw new AppError(
        "At least one ticket type must be created before publishing",
        400
      );
    }


    // 4️⃣ Publish event
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


  async getEvent(eventId, organizerId) {
    const event = await eventRepo.findById(eventId);
    if (!event) throw new AppError("Event not found", 404);

    if (event.organizerId !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    return event;
  },
};
