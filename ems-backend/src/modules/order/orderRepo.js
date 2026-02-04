import prisma from "../../config/db.js";

export const orderRepo = {
  async create(payload) {
    return prisma.order.create({
      data: payload,
    });
  },

  async findById(id) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        event: true,
        issuedTickets: {
          include: {
            ticketType: {
              include: {
                mappings: {
                  include: {
                    seatCategory: true,
                  },
                },
              },
            },
            seat: true,
          },
        },
      },
    });
  },

  async findByUserId(userId) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        event: { select: { id: true, title: true } },
        issuedTickets: {
          include: {
            ticketType: {
              include: {
                mappings: {
                  include: {
                    seatCategory: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async findByEventId(eventId) {
    return prisma.order.findMany({
      where: { eventId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        issuedTickets: {
          include: {
            ticketType: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async updateById(id, payload) {
    return prisma.order.update({
      where: { id },
      data: payload,
      include: {
        event: true,
        issuedTickets: {
          include: {
            ticketType: true,
          },
        },
      },
    });
  },

  async deleteById(id) {
    return prisma.order.delete({
      where: { id },
    });
  },
};