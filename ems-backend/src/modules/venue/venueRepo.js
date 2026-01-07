import  prisma  from "../../config/db.js"

export const venueRepo = {
  create(data) {
    return prisma.venue.create({ data });
  },

  findById(id) {
    return prisma.venue.findUnique({
      where: { id },
      include: {
        organizer: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  },

  findAll() {
    return prisma.venue.findMany({
      include: {
        organizer: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  findByOrganizer(organizerId) {
    return prisma.venue.findMany({
      where: { organizerId },
      include: {
        organizer: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  updateById(id, data) {
    return prisma.venue.update({
      where: { id },
      data,
      include: {
        organizer: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  },

  deleteById(id) {
    return prisma.venue.delete({
      where: { id },
    });
  },

  countPublishedEventsUsingVenue(id) {
    return prisma.event.count({
      where: {
        venueId: id,
        status: "PUBLISHED",
      },
    });
  },
};
