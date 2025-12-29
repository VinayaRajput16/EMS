import express from "express";
import { eventController } from "./eventController.js";
import {authMiddleware} from "../../common/middleware/authMiddleware.js";
import { requireRole } from "../../common/middleware/roleMiddleware.js";

const router = express.Router();

// Organizer-only routes
router.post(
  "/",
  authMiddleware,
  requireRole("ORGANIZER"),
  eventController.createEvent
);

router.patch(
  "/:id",
  authMiddleware,
  requireRole("ORGANIZER"),
  eventController.updateEvent
);

router.patch(
  "/:id/publish",
  authMiddleware,
  requireRole("ORGANIZER"),
  eventController.publishEvent
);

router.get(
  "/my",
  authMiddleware,
  requireRole("ORGANIZER"),
  eventController.getMyEvents
);

export default router;
