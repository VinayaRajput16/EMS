import prisma from "../../config/db.js";

export const seatCategoryRepo = {
  create(venueId, payload) {
    return prisma.seatCategory.create({
      data: {
        venueId,
        name: payload.name,
        priority: payload.priority,
        maxSeats: payload.maxSeats,
      },
    });
  },

  findByVenue(venueId) {
    return prisma.seatCategory.findMany({
      where: { venueId },
      orderBy: { priority: "asc" },
    });
  },
};
