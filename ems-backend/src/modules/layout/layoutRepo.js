import prisma from "../../config/db.js";

export const layoutRepo = {
  create(data) {
    return prisma.venueLayoutTemplate.create({ data });
  },

  findAll() {
    return prisma.venueLayoutTemplate.findMany({
      orderBy: { createdAt: "desc" }
    });
  },

  findById(id) {
    return prisma.venueLayoutTemplate.findUnique({ where: { id } });
  },

  updateById(id, data) {
    return prisma.venueLayoutTemplate.update({
      where: { id },
      data
    });
  },

  deleteById(id) {
    return prisma.venueLayoutTemplate.delete({ where: { id } });
  }
};
