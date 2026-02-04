import prisma from "../../config/db.js";

export const eventRepo = {
  create(data) {
    return prisma.event.create({ data });
  },

  findById(id) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      venue: true,
    },
  });
},

 findByOrganizer(organizerId) {
  return prisma.event.findMany({
    where: { organizerId },
    include: { venue: true },
    orderBy: { createdAt: "desc" },
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
  },
   /**
   * Find all published events with organizer and venue details
   */
  findAllPublished() {
    return prisma.event.findMany({
      where: {
        status: "PUBLISHED",
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        venue: {
          select: {
            id: true,
            name: true,
            capacity: true,
          },
        },
      },
      orderBy: {
        startDateTime: "asc",
      },
    });
  },

  /**
   * Find event by ID with full details including ticket types (for public viewing)
   */
   
  findByIdPublic(id) {
    return prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        venue: {
          select: {
            id: true,
            name: true,
            capacity: true,
          },
        },
        ticketTypes: {
          include: {
            mappings: {
              include: {
                seatCategory: true,
              },
            },
          },
        },
      },
    });
  }
};

