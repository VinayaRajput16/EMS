import { Router } from "express";
import { venueController } from "./venueController.js";
import { authMiddleware } from "../../common/middleware/authMiddleware.js";
import { requireRole } from "../../common/middleware/roleMiddleware.js";

const router = Router();

// ORGANIZER creates real venues
router.post(
  "/venues",
  authMiddleware,
  requireRole("ORGANIZER"),
  venueController.create
);

// ORGANIZER lists their venues
// ADMIN can read all venues (optional, handled in service if needed)
router.get(
  "/venues",
  authMiddleware,
  venueController.list
);

// ORGANIZER gets a venue by id (ownership enforced in service)
router.get(
  "/venues/:id",
  authMiddleware,
  venueController.getById
);

// ORGANIZER updates their venue
router.patch(
  "/venues/:id",
  authMiddleware,
  requireRole("ORGANIZER"),
  venueController.update
);

// ORGANIZER deletes their venue (only if not linked to published events)
router.delete(
  "/venues/:id",
  authMiddleware,
  requireRole("ORGANIZER"),
  venueController.remove
);

export default router;
