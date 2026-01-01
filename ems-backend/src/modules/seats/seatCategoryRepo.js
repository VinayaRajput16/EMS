import  prisma  from "../../config/db.js";

export const seatCategoryRepo = {
  create(eventId, payload) {
    return prisma.seatCategory.create({
      data: {
        eventId,
        name: payload.name,
        priority: payload.priority,
      },
    });
  },

  findByEvent(eventId) {
    return prisma.seatCategory.findMany({
      where: { eventId },
      orderBy: { priority: "asc" },
    });
  },

  findById(id) {
    return prisma.seatCategory.findUnique({
      where: { id },
    });
  },
};
