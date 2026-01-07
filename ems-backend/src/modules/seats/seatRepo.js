import prisma from "../../config/db.js";

export const seatRepo = {
  createMany(venueId, categoryId, seatsPayload) {
    return prisma.seat.createMany({
      data: seatsPayload.map(s => ({
        venueId,
        categoryId,
        label: s.label,
        status: "AVAILABLE"
      })),
      skipDuplicates: true
    });
  },

  findAvailableByCategory(venueId, categoryId) {
    return prisma.seat.findMany({
      where: {
        venueId,
        categoryId,
        status: "AVAILABLE"
      },
      select: {
        id: true,
        label: true,
      },
    });
  },

  findById(id) {
    return prisma.seat.findUnique({
      where: { id },
    });
  },

  lockSeat(tx, seatId) {
    return tx.seat.update({
      where: {
        id: seatId,
      },
      data: {
        status: "ALLOCATED",
      },
    });
  },

  unlockSeat(tx, seatId) {
    return tx.seat.update({
      where: {
        id: seatId,
      },
      data: {
        status: "AVAILABLE",
      },
    });
  },
};
