import { Router } from "express";
import { orderController } from "./orderController.js";
import { authMiddleware } from "../../common/middleware/authMiddleware.js";
import { requireRole } from "../../common/middleware/roleMiddleware.js";

const orderRouter = Router();

// Book ticket (authenticated users only)
orderRouter.post(
  "/orders",
  authMiddleware,
  requireRole("USER", "ORGANIZER"),
  orderController.book
);

// Get my bookings
orderRouter.get(
  "/my-bookings",
  authMiddleware,
  requireRole("USER", "ORGANIZER"),
  orderController.getMyBookings
);

// Get booking details
orderRouter.get(
  "/orders/:id",
  authMiddleware,
  requireRole("USER", "ORGANIZER"),
  orderController.getDetails
);

// Cancel booking
orderRouter.patch(
  "/orders/:id/cancel",
  authMiddleware,
  requireRole("USER", "ORGANIZER"),
  orderController.cancel
);

export default orderRouter;
