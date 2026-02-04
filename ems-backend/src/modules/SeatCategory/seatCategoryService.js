import AppError from "../../common/errors/AppError.js";
import { seatCategoryRepo } from "./seatCategoryRepo.js";
import { eventRepo } from "../event/eventRepo.js";
import { venueRepo } from "../venue/venueRepo.js";
import prisma from "../../config/db.js";


export const seatCategoryService = {
  async create(eventId, payload, organizerId) {
    const { name, priority, maxSeats } = payload;

    if (!name || priority == null || !maxSeats) {
      throw new AppError("Missing required fields", 400);
    }

    // Verify event ownership
    const event = await eventRepo.findById(eventId);
    if (!event) throw new AppError("Event not found", 404);
    if (event.organizerId !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    // Get venue
    const venue = await venueRepo.findByEventId(eventId);
    if (!venue) throw new AppError("Venue not found", 400);

    // Create category and seats in a transaction
    return prisma.$transaction(async (tx) => {
      // 1. Create the seat category
      const category = await tx.seatCategory.create({
        data: {
          venueId: venue.id,
          name,
          priority,
          maxSeats,
        },
      });

      // 2. AUTO-GENERATE SEATS based on maxSeats
      const seatsToCreate = [];
      for (let i = 1; i <= maxSeats; i++) {
        seatsToCreate.push({
          venueId: venue.id,
          categoryId: category.id,
          label: `${name.substring(0, 1).toUpperCase()}${i}`, // e.g., "B1", "G1"
          status: "AVAILABLE",
        });
      }

      // Batch create all seats
      await tx.seat.createMany({
        data: seatsToCreate,
      });

      console.log(`✅ Auto-created ${maxSeats} seats for category: ${name}`);

      return category;
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
