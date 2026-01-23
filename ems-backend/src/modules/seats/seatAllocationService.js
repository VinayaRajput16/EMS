import prisma from "../../config/db.js";
import AppError from "../../common/errors/AppError.js";
import { eventRepo } from "../event/eventRepo.js";
import { ticketTypeRepo } from "../ticket/ticketTypeRepo.js";

/**
 * Utility: deterministic seat label from index
 */
function seatLabelFromIndex(index, columns) {
  const rowIndex = Math.floor(index / columns);
  const colIndex = index % columns;
  const row = String.fromCharCode(65 + rowIndex); // A, B, C...
  const col = colIndex + 1;
  return `${row}${col}`;
}

/**
 * CORE MVP SEAT ALLOCATION
 * Seats are virtual and materialized only when allocated
 */
async function allocateSeatMVP({ tx, event, ticketType, issuedTicketId, userId }) {
  // 1. Get venue layout
  const venue = await tx.venue.findUnique({
    where: { id: event.venueId },
    select: { layoutConfig: true }
  });

  if (!venue?.layoutConfig) {
    throw new AppError("Venue layout not configured", 400);
  }

  const { rows, columns } = venue.layoutConfig;
  const capacity = rows * columns;

  // 2. Find seat category mapped to ticket type
  const mapping = await tx.ticketTypeCategory.findFirst({
    where: { ticketTypeId: ticketType.id },
    include: { seatCategory: true }
  });

  if (!mapping) {
    throw new AppError("Ticket type not mapped to a seat category", 400);
  }

  const category = mapping.seatCategory;

  // 3. Fetch all categories ordered by priority
  const categories = await tx.seatCategory.findMany({
    where: { venueId: event.venueId },
    orderBy: { priority: "asc" }
  });

  // 4. Calculate seat index range for this category
  let startIndex = 0;
  for (const c of categories) {
    if (c.id === category.id) break;
    startIndex += c.maxSeats;
  }
  const endIndex = startIndex + category.maxSeats;

  if (endIndex > capacity) {
    throw new AppError("Seat categories exceed venue capacity", 500);
  }

  // 5. Count already allocated seats in this category
  const allocatedCount = await tx.seat.count({
    where: {
      eventId: event.id,
      categoryId: category.id
    }
  });

  if (allocatedCount >= category.maxSeats) {
    throw new AppError(`No seats left in ${category.name}`, 400);
  }

  // 6. Get taken labels for this event
  const takenSeats = await tx.seat.findMany({
    where: { eventId: event.id },
    select: { label: true }
  });
  const takenSet = new Set(takenSeats.map(s => s.label));

  // 7. Find first free seat label
  let chosenLabel = null;
  for (let i = startIndex; i < endIndex; i++) {
    const label = seatLabelFromIndex(i, columns);
    if (!takenSet.has(label)) {
      chosenLabel = label;
      break;
    }
  }

  if (!chosenLabel) {
    throw new AppError(`No seats left in ${category.name}`, 400);
  }

  // 8. Persist allocated seat
  return tx.seat.create({
    data: {
      eventId: event.id,
      categoryId: category.id,
      label: chosenLabel,
      status: "ALLOCATED",
      orderId: issuedTicketId,
      userId
    }
  });
}

export const seatAllocationService = {
  /**
   * ISSUE TICKET + AUTO ALLOCATE SEAT (MVP)
   * Public API remains unchanged
   */
  async issueTicketWithAllocation(payload, userId) {
    const { eventId, ticketTypeId } = payload;

    if (!eventId || !ticketTypeId) {
      throw new AppError("Missing required fields", 400);
    }

    const event = await eventRepo.findById(eventId);
    if (!event) {
      throw new AppError("Event not found", 404);
    }

    const ticketType = await ticketTypeRepo.findById(ticketTypeId);
    if (!ticketType) {
      throw new AppError("Ticket type not found", 404);
    }

    if (ticketType.eventId !== eventId) {
      throw new AppError("Ticket type does not belong to this event", 400);
    }

    return prisma.$transaction(async (tx) => {
      // 1. Create issued ticket
      const issuedTicket = await tx.issuedTicket.create({
        data: {
          userId,
          eventId,
          ticketTypeId,
          seatId: null
        }
      });

      // 2. Allocate seat dynamically
      const seat = await allocateSeatMVP({
        tx,
        event,
        ticketType,
        issuedTicketId: issuedTicket.id,
        userId
      });

      // 3. Attach seat to issued ticket
      await tx.issuedTicket.update({
        where: { id: issuedTicket.id },
        data: { seatId: seat.id }
      });

      return tx.issuedTicket.findUnique({
        where: { id: issuedTicket.id },
        include: {
          seat: true,
          ticketType: true
        }
      });
    });
  }
};
