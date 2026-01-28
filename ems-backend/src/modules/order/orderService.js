import AppError from "../../common/errors/AppError.js";
import prisma from "../../config/db.js";
import { eventRepo } from "../event/eventRepo.js";
import { ticketTypeRepo } from "../ticket/ticketTypeRepo.js";
import { seatAllocationService } from "../seats/seatAllocationService.js";
import { orderRepo } from "./orderRepo.js";

export const orderService = {
  /**
   * Book tickets for an event
   */
  async book(payload, userId) {
    const { eventId, ticketTypeId, quantity } = payload;

    // 1️⃣ Basic validation
    if (!eventId || !ticketTypeId || !quantity) {
      throw new AppError("Missing required fields", 400);
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new AppError("Quantity must be a positive integer", 400);
    }

    // 2️⃣ Load event
    const event = await eventRepo.findById(eventId);
    if (!event) throw new AppError("Event not found", 404);

    if (event.status !== "PUBLISHED") {
      throw new AppError("Only published events can be booked", 400);
    }

    if (!event.venue) {
      throw new AppError("Event venue not configured", 400);
    }

    // 3️⃣ Load ticket type
    const ticketType = await ticketTypeRepo.findById(ticketTypeId);
    if (!ticketType || ticketType.eventId !== eventId) {
      throw new AppError("Invalid ticket type", 400);
    }

    // 4️⃣ Transaction starts
    return prisma.$transaction(async (tx) => {
      // 4.1️⃣ Create order
      const order = await tx.order.create({
        data: {
          userId,
          eventId,
          status: "PENDING",
        },
      });

      // 4.2️⃣ Create issued tickets
      const issuedTickets = [];

      for (let i = 0; i < quantity; i++) {
        const issuedTicket = await tx.issuedTicket.create({
          data: {
            userId,
            eventId,
            ticketTypeId,
            orderId: order.id,
          },
        });

        issuedTickets.push(issuedTicket);
      }

      // 4.3️⃣ Allocate seats ONLY if automated
      if (event.allocationMode === "AUTOMATED") {
        await seatAllocationService.allocateSeatsForOrder({
          tx,
          event,
          ticketTypeId,
          issuedTickets,
          orderId: order.id, // ← explicit and correct
        });
      }

      // 4.4️⃣ Confirm order
      return tx.order.update({
        where: { id: order.id },
        data: { status: "CONFIRMED" },
      });
    });
  },

  /**
   * Get bookings of logged-in user
   */
  async getMyBookings(userId) {
    return orderRepo.findByUserId(userId);
  },

  /**
   * Get single booking details
   */
  async getBookingDetails(orderId, userId) {
    const order = await orderRepo.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);
    if (order.userId !== userId) {
      throw new AppError("Unauthorized", 403);
    }
    return order;
  },

  /**
   * Cancel booking
   */
  async cancelBooking(orderId, userId) {
    const order = await orderRepo.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);
    if (order.userId !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    return prisma.$transaction(async (tx) => {
      // 1️⃣ Release seats linked to this order
      await tx.seat.updateMany({
        where: { orderId },
        data: {
          status: "AVAILABLE",
          orderId: null,
        },
      });

      // 2️⃣ Remove issued tickets
      await tx.issuedTicket.deleteMany({
        where: { orderId },
      });

      // 3️⃣ Cancel order
      return tx.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
      });
    });
  },
};
