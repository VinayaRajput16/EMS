import prisma from "../../config/db.js";

export const eventRepo = {
  create(data) {
    return prisma.event.create({ data });
  },

  findById(id) {
    return prisma.event.findUnique({ where: { id } });
  },

  findByOrganizer(organizerId) {
    return prisma.event.findMany({
      where: { organizerId },
      orderBy: { createdAt: "desc" }
    });
  },

  updateById(id, data) {
    return prisma.event.update({
      where: { id },
      data
    });
  },

  deleteById(id) {
    return prisma.event.delete({
      where: { id }
    });
  }
};

