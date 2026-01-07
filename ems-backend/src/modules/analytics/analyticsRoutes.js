import { Router } from "express";
import { analyticsController } from "./analyticsController.js";
import { authMiddleware } from "../../common/middleware/authMiddleware.js";
import { requireRole } from "../../common/middleware/roleMiddleware.js";

const analyticsRouter = Router();

// ORGANIZER routes
analyticsRouter.get(
  "/organizer/sales-summary",
  authMiddleware,
  requireRole("ORGANIZER"),
  analyticsController.getOrganizerSalesSummary
);

analyticsRouter.get(
  "/organizer/events/:eventId/orders",
  authMiddleware,
  requireRole("ORGANIZER"),
  analyticsController.getOrganizerEventOrders
);

// ADMIN routes
analyticsRouter.get(
  "/admin/events",
  authMiddleware,
  requireRole("ADMIN"),
  analyticsController.getAdminAllEvents
);

analyticsRouter.get(
  "/admin/orders",
  authMiddleware,
  requireRole("ADMIN"),
  analyticsController.getAdminAllOrders
);

analyticsRouter.get(
  "/admin/events/:eventId",
  authMiddleware,
  requireRole("ADMIN"),
  analyticsController.getAdminEventDetails
);

analyticsRouter.patch(
  "/admin/events/:eventId/block",
  authMiddleware,
  requireRole("ADMIN"),
  analyticsController.blockEvent
);

analyticsRouter.get(
  "/admin/order-stats",
  authMiddleware,
  requireRole("ADMIN"),
  analyticsController.getOrderStats
);

export default analyticsRouter;
