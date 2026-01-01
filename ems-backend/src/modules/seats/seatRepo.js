import prisma  from "../../config/db.js";

export const seatRepo = {
  createMany(eventId, categoryId, seatsPayload) {
    return prisma.seat.createMany({
      data: seatsPayload.map((s) => ({
        eventId,
        categoryId,
        label: s.label,
      })),
      skipDuplicates: true,
    });
  },

  findAvailableByCategory(categoryId) {
    return prisma.seat.findMany({
      where: {
        categoryId,
        status: "AVAILABLE",
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
