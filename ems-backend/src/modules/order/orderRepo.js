import  prisma  from "../../config/db.js";

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
        ticket: true,
        event: true,
      },
    });
  },

  async findByUserId(userId) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        ticket: true,
        event: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async findByEventId(eventId) {
    return prisma.order.findMany({
      where: { eventId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        ticket: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async findByTicketId(ticketId) {
    return prisma.order.findMany({
      where: { ticketId },
    });
  },

  async updateById(id, payload) {
    return prisma.order.update({
      where: { id },
      data: payload,
      include: {
        ticket: true,
        event: true,
      },
    });
  },

  async deleteById(id) {
    return prisma.order.delete({
      where: { id },
    });
  },

  // Atomic transaction: check availability and book
  async bookWithLock(userId, eventId, ticketId, quantity) {
    return prisma.$transaction(async (tx) => {
      // Check ticket exists
      const ticket = await tx.ticket.findUnique({
        where: { id: ticketId },
      });

      if (!ticket) {
        throw new Error("Ticket not found");
      }

      // Check availability
      if (ticket.availableQuantity < quantity) {
        throw new Error("Not enough tickets available");
      }

      // Reduce available quantity
      await tx.ticket.update({
        where: { id: ticketId },
        data: {
          availableQuantity: ticket.availableQuantity - quantity,
        },
      });

      // Create order
      return tx.order.create({
        data: {
          userId,
          eventId,
          ticketId,
          quantity,
          status: "CONFIRMED",
        },
        include: {
          ticket: true,
          event: true,
        },
      });
    });
  },
};
