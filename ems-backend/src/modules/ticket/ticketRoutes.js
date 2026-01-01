import { Router } from "express";
import { ticketController } from "./ticketController.js";
import { authMiddleware } from "../../common/middleware/authMiddleware.js";
import { requireRole } from "../../common/middleware/roleMiddleware.js";

const ticketRouter = Router();

// Create ticket (organizer only, on specific event)
ticketRouter.post(
  "/events/:eventId/tickets",
  authMiddleware,
  requireRole(["ORGANIZER"]),
  ticketController.create
);

// Get all tickets for event (public)
ticketRouter.get("/events/:eventId/tickets", ticketController.getByEvent);

// Update ticket (organizer only)
ticketRouter.put(
  "/tickets/:id",
  authMiddleware,
  requireRole(["ORGANIZER"]),
  ticketController.update
);

// Delete ticket (organizer only)
ticketRouter.delete(
  "/tickets/:id",
  authMiddleware,
  requireRole(["ORGANIZER"]),
  ticketController.delete
);

export default ticketRouter;
