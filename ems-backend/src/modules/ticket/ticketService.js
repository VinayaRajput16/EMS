import { ticketRepo } from "./ticketRepo.js";
import { eventRepo } from "../event/eventRepo.js";
import AppError from "../../common/errors/AppError.js";

export const ticketService = {
  async create(payload, eventId, organizerId) {
    const { name, price, totalQuantity } = payload;

    // Validate required fields
    if (!name || price === undefined || !totalQuantity) {
      throw new AppError("Missing required fields", 400);
    }

    // Validate event exists
    const event = await eventRepo.findById(eventId);
    if (!event) throw new AppError("Event not found", 404);

    // Verify organizer ownership
    if (event.organizerId !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    // Prevent ticket creation on published events
    if (event.status === "PUBLISHED") {
      throw new AppError("Cannot add tickets to published events", 400);
    }

    // Validate quantity and price
    if (totalQuantity <= 0) {
      throw new AppError("Total quantity must be greater than 0", 400);
    }
    if (price < 0) {
      throw new AppError("Price cannot be negative", 400);
    }

    return ticketRepo.create({
      eventId,
      name,
      price,
      totalQuantity,
      availableQuantity: totalQuantity,
    });
  },

  async getEventTickets(eventId) {
    const event = await eventRepo.findById(eventId);
    if (!event) throw new AppError("Event not found", 404);

    return ticketRepo.findByEventId(eventId);
  },

  async update(ticketId, payload, organizerId) {
    const ticket = await ticketRepo.findById(ticketId);
    if (!ticket) throw new AppError("Ticket not found", 404);

    // Verify event ownership
    const event = await eventRepo.findById(ticket.eventId);
    if (event.organizerId !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    // Prevent updates on published events
    if (event.status === "PUBLISHED") {
      throw new AppError("Cannot edit tickets on published events", 400);
    }

    // Validate if updating quantities
    if (payload.totalQuantity !== undefined && payload.totalQuantity <= 0) {
      throw new AppError("Total quantity must be greater than 0", 400);
    }
    if (payload.price !== undefined && payload.price < 0) {
      throw new AppError("Price cannot be negative", 400);
    }

    return ticketRepo.updateById(ticketId, payload);
  },

  async delete(ticketId, organizerId) {
    const ticket = await ticketRepo.findById(ticketId);
    if (!ticket) throw new AppError("Ticket not found", 404);

    const event = await eventRepo.findById(ticket.eventId);
    if (event.organizerId !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    if (event.status === "PUBLISHED") {
      throw new AppError("Cannot delete tickets from published events", 400);
    }

    return ticketRepo.deleteById(ticketId);
  },
};
