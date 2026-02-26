import AppError from "../../common/errors/AppError.js";
import { ticketTypeRepo } from "../ticket/ticketTypeRepo.js";
import { seatCategoryRepo } from "../SeatCategory/seatCategoryRepo.js";
import { eventRepo } from "../event/eventRepo.js";
import { seatRepo } from "../seats/seatRepo.js";
import prisma from "../../config/db.js";


export const seatAllocationService = {

async allocateSeatsForOrder({
  tx,
  event,
  ticketTypeId,
  issuedTickets,
  orderId,
}) {
  // 1️⃣ Load ticket type with mappings
  const ticketType = await ticketTypeRepo.findById(ticketTypeId);

  if (!ticketType) {
    throw new AppError("Invalid ticket type", 400);
  }

  const allowedCategoryIds = ticketType.mappings.map(
    (m) => m.seatCategoryId
  );

  if (allowedCategoryIds.length === 0) {
    throw new AppError(
      "Ticket type has no seat categories mapped",
      400
    );
  }

  // 2️⃣ Load categories in priority order
  const categories = await seatCategoryRepo.findByVenue(
    event.venue.id
  );

  const allowedCategories = categories.filter((c) =>
    allowedCategoryIds.includes(c.id)
  );

  if (allowedCategories.length === 0) {
    throw new AppError(
      "No valid seat categories for this ticket type",
      400
    );
  }

  // 3️⃣ Allocate one seat per issued ticket
  for (const issuedTicket of issuedTickets) {
    let allocated = false;

    for (const category of allowedCategories) {
      //Find an AVAILABLE seat instead of counting all seats
      const availableSeat = await tx.seat.findFirst({
        where: {
          venueId: event.venue.id,
          categoryId: category.id,
          status: "AVAILABLE", // ✅ Only look for available seats
        },
      });

      // If no available seat in this category, try next category
      if (!availableSeat) continue;

      // Update the seat to ALLOCATED
      await tx.seat.update({
        where: { id: availableSeat.id },
        data: {
          status: "ALLOCATED",
          orderId,
        },
      });

      // Link seat to issued ticket
      await tx.issuedTicket.update({
        where: { id: issuedTicket.id },
        data: { seatId: availableSeat.id },
      });

      allocated = true;
      break;
    }

    if (!allocated) {
      throw new AppError("No seats available", 400);
    }
  }
},
  async getEventSeatsForOrganizer(eventId, organizerId) {
  // Verify event belongs to organizer
  const event = await eventRepo.findById(eventId);
  
  if (!event) {
    throw new AppError("Event not found", 404);
  }

  if (event.organizerId !== organizerId) {
    throw new AppError("Unauthorized", 403);
  }

  if (!event.venue) {
    throw new AppError("Event has no venue", 400);
  }
  },
   async getEventSeatsForOrganizer(eventId, organizerId) {
    // Verify event belongs to organizer
    const event = await eventRepo.findById(eventId);
    
    if (!event) {
      throw new AppError("Event not found", 404);
    }

    if (event.organizerId !== organizerId) {
      throw new AppError("Unauthorized", 403);
    }

    if (!event.venue) {
      throw new AppError("Event has no venue", 400);
    }

    // Use repository to get seats
    return seatRepo.findByVenueWithDetails(event.venue.id);
  },
  async getAvailableSeatsForEvent(eventId) {
  // Get event with venue
  const event = await eventRepo.findById(eventId);
  
  if (!event) {
    throw new AppError("Event not found", 404);
  }

  if (!event.venue) {
    throw new AppError("Event has no venue", 400);
  }

  // Get all AVAILABLE seats for this venue, grouped by category
  const seats = await prisma.seat.findMany({
    where: {
      venueId: event.venue.id,
      status: "AVAILABLE",
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          priority: true,
        },
      },
    },
    orderBy: {
      label: "asc",
    },
  });

  // Group seats by category
  const categoriesMap = {};
  
  seats.forEach(seat => {
    const catId = seat.category.id;
    
    if (!categoriesMap[catId]) {
      categoriesMap[catId] = {
        categoryId: seat.category.id,
        categoryName: seat.category.name,
        priority: seat.category.priority,
        seats: [],
      };
    }
    
    categoriesMap[catId].seats.push({
      id: seat.id,
      label: seat.label,
    });
  });

  // Convert to array and sort by priority
  return Object.values(categoriesMap).sort((a, b) => a.priority - b.priority);
},
};
