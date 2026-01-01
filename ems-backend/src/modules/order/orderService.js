import prisma from "../../config/db.js";
import AppError from "../../common/errors/AppError.js";

import { eventRepo } from "../event/eventRepo.js";
import { ticketRepo } from "../ticket/ticketRepo.js";
import { orderRepo } from "./orderRepo.js";
import { seatAllocationService } from "../seats/seatAllocationService.js";

export const orderService = {
  async book(payload, userId) {
    const { eventId, ticketId, quantity } = payload;

    // 1️⃣ Basic validations
    if (!eventId || !ticketId || !quantity) {
      throw new AppError("Missing required fields", 400);
    }

    if (quantity <= 0) {
      throw new AppError("Quantity must be greater than 0", 400);
    }

    // 2️⃣ Fetch and validate event
    const event = await eventRepo.findById(eventId);
    if (!event) throw new AppError("Event not found", 404);

    if (event.status !== "PUBLISHED") {
      throw new AppError("Only published events can be booked", 400);
    }

    // 3️⃣ Transaction: order + seat allocation + ticket update
    return await prisma.$transaction(async (tx) => {
      // 3.1 Create order (PENDING)
      const order = await tx.order.create({
        data: {
          userId,
          eventId,
          ticketId,
          quantity,
          status: "PENDING",
        },
      });

      // 3.2 Allocate seats (only if automated)
      if (event.allocationMode === "AUTOMATED") {
        await seatAllocationService({
          tx,
          eventId,
          quantity,
          orderId: order.id,
        });
      }

      // 3.3 Validate ticket
      const ticket = await tx.ticket.findUnique({
        where: { id: ticketId },
      });

      if (!ticket) {
        throw new AppError("Ticket not found", 404);
      }

      if (ticket.eventId !== eventId) {
        throw new AppError("Ticket does not belong to this event", 400);
      }

      if (ticket.availableQuantity < quantity) {
        throw new AppError("Not enough tickets available", 400);
      }

      // 3.4 Decrease ticket quantity
      await tx.ticket.update({
        where: { id: ticketId },
        data: {
          availableQuantity: {
            decrement: quantity,
          },
        },
      });

      // 3.5 Confirm order
      return await tx.order.update({
        where: { id: order.id },
        data: { status: "CONFIRMED" },
      });
    });
  },

  async getMyBookings(userId) {
    return orderRepo.findByUserId(userId);
  },

  async getBookingDetails(orderId, userId) {
    const order = await orderRepo.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);

    if (order.userId !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    return order;
  },

  async cancelBooking(orderId, userId) {
    const order = await orderRepo.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);

    if (order.userId !== userId) {
      throw new AppError("Unauthorized", 403);
    }

    if (order.status === "CANCELLED") {
      throw new AppError("Order already cancelled", 400);
    }

    return await prisma.$transaction(async (tx) => {
      // 1️⃣ Release seats
      await tx.seat.updateMany({
        where: { orderId },
        data: {
          status: "AVAILABLE",
          orderId: null,
        },
      });

      // 2️⃣ Restore ticket quantity
      await tx.ticket.update({
        where: { id: order.ticketId },
        data: {
          availableQuantity: {
            increment: order.quantity,
          },
        },
      });

      // 3️⃣ Cancel order
      return await tx.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
      });
    });
  },
};
