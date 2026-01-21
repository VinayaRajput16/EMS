import { eventRepo } from "./eventRepo.js";
import AppError from "../../common/errors/AppError.js";
import prisma from "../../config/db.js";

export const eventService = {
  async create(payload, organizerId) {
    const {
      title,
      description,
      startDateTime,
      endDateTime,
      allocationMode
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
      startDateTime: start,   // ✅ REQUIRED FIX
      endDateTime: end,       // ✅ REQUIRED FIX
      venueId: null           // ✅ REQUIRED IF OPTIONAL IN SCHEMA
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
    return await prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: { id: eventId }
      });
      if (!event) throw new AppError("Event not found", 404);

      if (event.organizerId !== organizerId) {
        throw new AppError("Unauthorized", 403);
      }

      if (event.status !== "DRAFT") {
        throw new AppError("Only draft events can be published", 400);
      }

      if (!event.venueId) {
        throw new AppError("Venue must be attached before publishing", 400);
      }

      const seatCount = await tx.seat.count({
        where: { venueId: event.venueId }
      });

      if (seatCount === 0) {
        throw new AppError("Venue has no seats configured", 400);
      }

      await tx.seat.updateMany({
        where: {
          venueId: event.venueId,
          eventId: null
        },
        data: {
          eventId: event.id
        }
      });

      return tx.event.update({
        where: { id: eventId },
        data: { status: "PUBLISHED" }
      });
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

    return eventRepo.updateById(eventId, { venueId });
  },

  async getEvent(eventId, organizerId) {
    const event = await eventRepo.findById(eventId);
    if (!event) throw new AppError("Event not found", 404);
    if (event.organizerId !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }
    return event;
  }
};
