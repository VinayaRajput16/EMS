import  prisma  from "../../config/db.js";

export const analyticsRepo = {
  // Organizer: Get sales summary per event
  async getOrganizerSalesSummary(organizerId) {
    return prisma.event.findMany({
      where: { organizerId },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        tickets: {
          select: {
            id: true,
            name: true,
            price: true,
            totalQuantity: true,
            availableQuantity: true,
            orders: {
              where: { status: "CONFIRMED" },
              select: { quantity: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  // Organizer: Get detailed orders for an event
  async getOrganizerEventOrders(eventId, organizerId) {
    return prisma.event.findFirst({
      where: { id: eventId, organizerId },
      select: {
        id: true,
        title: true,
        orders: {
          include: {
            user: { select: { name: true, email: true } },
            ticket: { select: { name: true, price: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  },

  // Admin: Get all events with basic info
  async getAllEventsForAdmin() {
    return prisma.event.findMany({
      include: {
        organizer: { select: { name: true, email: true } },
        _count: {
          select: { tickets: true, orders: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  // Admin: Get all orders with details
  async getAllOrdersForAdmin(limit = 50, skip = 0) {
    return prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        event: { select: { title: true } },
        ticket: { select: { name: true, price: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
    });
  },

  // Admin: Get event details with all relations
  async getAdminEventDetails(eventId) {
    return prisma.event.findUnique({
      where: { id: eventId },
      include: {
        organizer: { select: { name: true, email: true } },
        tickets: {
          include: {
            orders: {
              include: {
                user: { select: { name: true, email: true } },
              },
            },
          },
        },
      },
    });
  },

  // Admin: Block/soft cancel event
  async blockEvent(eventId) {
    return prisma.event.update({
      where: { id: eventId },
      data: { status: "CANCELLED" },
    });
  },

  // Admin: Get order statistics
  async getOrderStats() {
    const stats = await prisma.order.groupBy({
      by: ["status"],
      _count: true,
    });

    const totalRevenue = await prisma.order.aggregate({
      where: { status: "CONFIRMED" },
      _sum: {
        ticket: {
          price: true,
        },
      },
    });

    return { statusBreakdown: stats };
  },
};
