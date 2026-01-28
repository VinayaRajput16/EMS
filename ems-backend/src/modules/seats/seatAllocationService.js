import AppError from "../../common/errors/AppError.js";
import { ticketTypeRepo } from "../ticket/ticketTypeRepo.js";
import { seatCategoryRepo } from "../seatCategory/seatCategoryRepo.js";

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
        const allocatedCount = await tx.seat.count({
          where: {
            venueId: event.venue.id,
            categoryId: category.id,
          },
        });

        if (allocatedCount >= category.maxSeats) continue;

        const seat = await tx.seat.create({
          data: {
            venueId: event.venue.id,
            categoryId: category.id,
            orderId, // ✅ THIS WAS MISSING
            label: `${category.name}-${allocatedCount + 1}`,
            status: "ALLOCATED",
          },
        });

        await tx.issuedTicket.update({
          where: { id: issuedTicket.id },
          data: { seatId: seat.id },
        });

        allocated = true;
        break;
      }

      if (!allocated) {
        throw new AppError("No seats available", 400);
      }
    }
  },
};
