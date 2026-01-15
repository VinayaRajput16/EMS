import { eventRepo } from "./eventRepo.js";
import AppError from "../../common/errors/AppError.js";
import prisma from "../../config/db.js";


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
  return await prisma.$transaction(async (tx) => {
    // 1. Fetch event
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

    // 2. Ensure venue has seats
    const seatCount = await tx.seat.count({
      where: { venueId: event.venueId }
    });

    if (seatCount === 0) {
      throw new AppError("Venue has no seats configured", 400);
    }

    // 3. Attach venue seats to event
    await tx.seat.updateMany({
      where: {
        venueId: event.venueId,
        eventId: null
      },
      data: {
        eventId: event.id
      }
    });

    // 4. Publish event
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
    if (event.organizerId !== organizerId) throw new AppError("Unauthorized", 403);
    return event;
  }

};
