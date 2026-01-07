import prisma from "../../config/db.js";
import AppError from "../../common/errors/AppError.js";
import { eventRepo } from "../event/eventRepo.js";
import { issuedTicketRepo } from "./issuedTicketRepo.js";
import { ticketTypeRepo } from "../ticket/ticketTypeRepo.js";

/**
 * Allocate N seats for an order
 * Must be called INSIDE a Prisma transaction
 */
async function allocateSeatsForOrder({
  tx,
  eventId,
  quantity,
  orderId
}) {
  const availableSeats = await tx.seat.findMany({
    where: {
      eventId,
      status: "AVAILABLE"
    },
    take: quantity
  });

  if (availableSeats.length < quantity) {
    throw new AppError("Not enough seats available", 400);
  }

  const seatIds = availableSeats.map(s => s.id);

  await tx.seat.updateMany({
    where: {
      id: { in: seatIds },
      status: "AVAILABLE"
    },
    data: {
      status: "ALLOCATED",
      orderId: orderId
    }
  });

  return availableSeats;
}

export const seatAllocationService = {
  /**
   * Allocate seats for an order (used by orderService)
   */
  allocateSeatsForOrder,

  /**
   * Issue a ticket with automatic seat allocation if event is in AUTOMATED mode
   */
  async issueTicketWithAllocation(payload, userId) {
    const { eventId, ticketTypeId } = payload;

    if (!eventId || !ticketTypeId) {
      throw new AppError("Missing required fields: eventId and ticketTypeId", 400);
    }

    // Fetch event to check allocation mode
    const event = await eventRepo.findById(eventId);
    if (!event) {
      throw new AppError("Event not found", 404);
    }

    // Fetch ticket type
    const ticketType = await ticketTypeRepo.findById(ticketTypeId);
    if (!ticketType) {
      throw new AppError("Ticket type not found", 404);
    }

    if (ticketType.eventId !== eventId) {
      throw new AppError("Ticket type does not belong to this event", 400);
    }

    return await prisma.$transaction(async (tx) => {
      // Create issued ticket
      const issuedTicket = await issuedTicketRepo.create(tx, {
        userId,
        eventId,
        ticketTypeId,
        seatId: null, // Will be assigned if automated
      });

      // Auto-allocate seat if event is in AUTOMATED mode
      if (event.allocationMode === "AUTOMATED") {
        const availableSeats = await tx.seat.findMany({
          where: {
            eventId,
            status: "AVAILABLE"
          },
          take: 1
        });

        if (availableSeats.length > 0) {
          const seat = availableSeats[0];
          await tx.seat.update({
            where: { id: seat.id },
            data: {
              status: "ALLOCATED"
            }
          });

          await tx.issuedTicket.update({
            where: { id: issuedTicket.id },
            data: { seatId: seat.id }
          });

          // Reload with seat within transaction
          return await tx.issuedTicket.findUnique({
            where: { id: issuedTicket.id },
            include: {
              ticketType: true,
              seat: true,
            },
          });
        }
      }

      return issuedTicket;
    });
  },

  /**
   * Manually assign a seat to an issued ticket (for organizers)
   */
  async assignSeatManually(issuedTicketId, seatId, userId) {
    if (!issuedTicketId || !seatId) {
      throw new AppError("Missing required fields: issuedTicketId and seatId", 400);
    }

    // Fetch issued ticket
    const issuedTicket = await issuedTicketRepo.findById(issuedTicketId);
    if (!issuedTicket) {
      throw new AppError("Issued ticket not found", 404);
    }

    // Check if seat exists and is available
    const seat = await prisma.seat.findUnique({
      where: { id: seatId }
    });

    if (!seat) {
      throw new AppError("Seat not found", 404);
    }

    if (seat.eventId !== issuedTicket.eventId) {
      throw new AppError("Seat does not belong to this event", 400);
    }

    if (seat.status === "ALLOCATED" && seat.id !== issuedTicket.seatId) {
      throw new AppError("Seat is already allocated", 400);
    }

    return await prisma.$transaction(async (tx) => {
      // If ticket already has a seat, release it
      if (issuedTicket.seatId) {
        await tx.seat.update({
          where: { id: issuedTicket.seatId },
          data: { status: "AVAILABLE" }
        });
      }

      // Assign new seat
      await tx.seat.update({
        where: { id: seatId },
        data: { status: "ALLOCATED" }
      });

      // Update issued ticket
      return await issuedTicketRepo.assignSeat(tx, issuedTicketId, seatId);
    });
  }
};
