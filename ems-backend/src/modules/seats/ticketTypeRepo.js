import  prisma  from "../../config/db.js";

export const ticketTypeRepo = {
  create(eventId, payload) {
    return prisma.ticketType.create({
      data: {
        eventId,
        name: payload.name,
        price: payload.price,
      },
    });
  },

  findById(id) {
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

  attachCategories(ticketTypeId, categoryIds) {
    return prisma.ticketTypeCategory.createMany({
      data: categoryIds.map((categoryId) => ({
        ticketTypeId,
        seatCategoryId: categoryId,
      })),
      skipDuplicates: true,
    });
  },
};
