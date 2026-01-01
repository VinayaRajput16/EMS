import  prisma  from "../../config/db.js";

export const ticketRepo = {
  async create(payload) {
    return prisma.ticket.create({
      data: payload,
    });
  },

  async findById(id) {
    return prisma.ticket.findUnique({
      where: { id },
    });
  },

  async findByEventId(eventId) {
    return prisma.ticket.findMany({
      where: { eventId },
      orderBy: { createdAt: "asc" },
    });
  },

  async updateById(id, payload) {
    return prisma.ticket.update({
      where: { id },
      data: payload,
    });
  },

  async deleteById(id) {
    return prisma.ticket.delete({
      where: { id },
    });
  },

  async deleteByEventId(eventId) {
    return prisma.ticket.deleteMany({
      where: { eventId },
    });
  },
};
