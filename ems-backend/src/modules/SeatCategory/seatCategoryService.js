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
          label: `${name.substring(0, 1).toUpperCase()}${i}`,
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

  // NEW: Update seat category
  async update(categoryId, payload, organizerId) {
    // Get category with venue and event to verify ownership
    const category = await prisma.seatCategory.findUnique({
      where: { id: categoryId },
      include: {
        venue: {
          include: {
            event: true,
          },
        },
      },
    });

    if (!category) {
      throw new AppError("Seat category not found", 404);
    }

    if (category.venue.event.organizerId !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    // Check if event is published
    if (category.venue.event.status === "PUBLISHED") {
      throw new AppError("Cannot modify seat categories of published events", 400);
    }

    // Update only allowed fields
    const { name, priority, maxSeats } = payload;
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (priority !== undefined) updateData.priority = priority;
    if (maxSeats !== undefined) updateData.maxSeats = maxSeats;

    return prisma.seatCategory.update({
      where: { id: categoryId },
      data: updateData,
    });
  },

  // NEW: Delete seat category
  async delete(categoryId, organizerId) {
    // Get category with venue and event to verify ownership
    const category = await prisma.seatCategory.findUnique({
      where: { id: categoryId },
      include: {
        venue: {
          include: {
            event: true,
          },
        },
        seats: true,
        ticketTypeCategories: true, // FIXED: Correct field name from schema
      },
    });

    if (!category) {
      throw new AppError("Seat category not found", 404);
    }

    if (category.venue.event.organizerId !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    // Check if event is published
    if (category.venue.event.status === "PUBLISHED") {
      throw new AppError("Cannot delete seat categories from published events", 400);
    }

    // Check if any seats are allocated
    const allocatedSeats = category.seats.filter(s => s.status === "ALLOCATED");
    if (allocatedSeats.length > 0) {
      throw new AppError("Cannot delete category with allocated seats", 400);
    }

    // Check if any ticket types are mapped to this category
    if (category.ticketTypeCategories.length > 0) {
      throw new AppError("Cannot delete category with ticket type mappings. Delete the ticket types first.", 400);
    }

    // Delete in transaction: seats first, then category
    return prisma.$transaction(async (tx) => {
      // Delete all seats
      await tx.seat.deleteMany({
        where: { categoryId },
      });

      // Delete category
      await tx.seatCategory.delete({
        where: { id: categoryId },
      });
    });
  },
};