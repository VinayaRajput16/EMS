// REPLACE YOUR seatAllocationRoutes.js with this:

import { Router } from "express";
import { seatAllocationController } from "./seatAllocationController.js";
import { requireRole } from "../../common/middleware/roleMiddleware.js";
import { authMiddleware } from "../../common/middleware/authMiddleware.js";

const router = Router();

// ⚠️ Disabled in MVP
router.post(
  "/events/:eventId/seats/allocate",
  seatAllocationController.allocate
);

// PUBLIC: Get available seats for an event (for users to select)
router.get(
  "/events/:eventId/available-seats",
  seatAllocationController.getAvailableSeats
);

// ORGANIZER ONLY: Get all seats with allocation details
router.get(
  "/events/:eventId/seats",
  authMiddleware,
  requireRole("ORGANIZER"),
  seatAllocationController.getEventSeats
);

export default router;