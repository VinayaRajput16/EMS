import prisma from "../../config/db.js";

export const ticketTypeRepo = {
  async findById(id) {
    return prisma.ticketType.findUnique({
      where: { id },
      include: {
        mappings: {
          include: {
            seatCategory: true,
          },
        },
      },
    });
  },

  async findByEvent(eventId) {
    return prisma.ticketType.findMany({
      where: { eventId },
      include: {
        mappings: {
          include: {
            seatCategory: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  },

  async updateById(id, payload) {
    return prisma.ticketType.update({
      where: { id },
      data: payload,
    });
  },

  async deleteById(id) {
    return prisma.ticketType.delete({
      where: { id },
    });
  },

  async deleteByEventId(eventId) {
    return prisma.ticketType.deleteMany({
      where: { eventId },
    });
  },
};