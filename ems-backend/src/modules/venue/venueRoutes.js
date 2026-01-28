import { Router } from "express";
import { venueController } from "./venueController.js";
import { authMiddleware } from "../../common/middleware/authMiddleware.js";
import { requireRole } from "../../common/middleware/roleMiddleware.js";

const router = Router();

// Create venue for an event (ONLY ONCE)
router.post(
  "/events/:eventId/venue",
  authMiddleware,
  requireRole("ORGANIZER"),
  venueController.createForEvent
);

// Get venue for an event
router.get(
  "/events/:eventId/venue",
  authMiddleware,
  venueController.getByEvent
);

export default router;
