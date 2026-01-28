import prisma from "../../config/db.js";

export const venueRepo = {
  create(data) {
    return prisma.venue.create({ data });
  },

  findByEventId(eventId) {
    return prisma.venue.findUnique({
      where: { eventId },
      include: {
        seatCategories: true,
        seats: true,
      },
    });
  },
};
