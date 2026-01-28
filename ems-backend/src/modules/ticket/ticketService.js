import { eventRepo } from "../event/eventRepo.js";
import { ticketTypeRepo } from "./ticketTypeRepo.js";
import AppError from "../../common/errors/AppError.js";
import prisma from "../../config/db.js";

export const ticketService = {
  async create(eventId, payload, organizerId) {  // ✅ FIXED ORDER
    const { name, price, seatCategoryIds = [] } = payload;

    if (!name || price == null) {
      throw new AppError("Missing required fields", 400);
    }

    const event = await eventRepo.findById(eventId);
    if (!event) throw new AppError("Event not found", 404);
    if (event.organizerId !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    if (event.status === "PUBLISHED") {
      throw new AppError("Cannot add tickets after publish", 400);
    }

    return prisma.$transaction(async (tx) => {
      // ✅ CREATE TicketType (NOT Ticket)
      const ticketType = await tx.ticketType.create({
        data: {
          eventId,
          name,
          price,
        },
      });

      // ✅ MAP seat categories (FK-safe)
      if (seatCategoryIds.length > 0) {
        await tx.ticketTypeCategory.createMany({
          data: seatCategoryIds.map((categoryId) => ({
            ticketTypeId: ticketType.id,
            seatCategoryId: categoryId,
          })),
        });
      }

      // ✅ Return with relations
      return tx.ticketType.findUnique({
        where: { id: ticketType.id },
        include: {
          mappings: {
            include: {
              seatCategory: true,
            },
          },
        },
      });
    });
  },

  async getEventTickets(eventId) {
    return ticketTypeRepo.findByEvent(eventId);
  },

  async update(ticketTypeId, payload, organizerId) {  // ✅ ADDED
    const { name, price, seatCategoryIds } = payload;

    const ticketType = await ticketTypeRepo.findById(ticketTypeId);
    if (!ticketType) throw new AppError("Ticket not found", 404);

    const event = await eventRepo.findById(ticketType.eventId);
    if (event.organizerId !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    if (event.status === "PUBLISHED") {
      throw new AppError("Cannot update tickets after publish", 400);
    }

    return prisma.$transaction(async (tx) => {
      // Update basic fields
      const updated = await tx.ticketType.update({
        where: { id: ticketTypeId },
        data: {
          ...(name && { name }),
          ...(price != null && { price }),
        },
      });

      // Update seat category mappings if provided
      if (seatCategoryIds) {
        // Delete existing mappings
        await tx.ticketTypeCategory.deleteMany({
          where: { ticketTypeId },
        });

        // Create new mappings
        if (seatCategoryIds.length > 0) {
          await tx.ticketTypeCategory.createMany({
            data: seatCategoryIds.map((categoryId) => ({
              ticketTypeId,
              seatCategoryId: categoryId,
            })),
          });
        }
      }

      // Return with relations
      return tx.ticketType.findUnique({
        where: { id: ticketTypeId },
        include: {
          mappings: {
            include: {
              seatCategory: true,
            },
          },
        },
      });
    });
  },

  async delete(ticketTypeId, organizerId) {
    const ticketType = await ticketTypeRepo.findById(ticketTypeId);
    if (!ticketType) throw new AppError("Ticket not found", 404);

    const event = await eventRepo.findById(ticketType.eventId);
    if (event.organizerId !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    if (event.status === "PUBLISHED") {
      throw new AppError("Cannot delete tickets after publish", 400);
    }

    return ticketTypeRepo.deleteById(ticketTypeId);
  },
};