import { Router } from "express";
import { venueController } from "./venueController.js";
import { authMiddleware } from "../../common/middleware/authMiddleware.js";
import { requireRole } from "../../common/middleware/roleMiddleware.js";

const venueRouter = Router();

// Create venue (organizer only)
venueRouter.post(
  "/venues",
  authMiddleware,
  requireRole("ORGANIZER"),
  venueController.create
);

// List venues (role-aware, but all authenticated roles can read)
venueRouter.get(
  "/venues",
  authMiddleware,
  requireRole("ADMIN", "ORGANIZER", "USER"),
  venueController.list
);

// Get venue by id
venueRouter.get(
  "/venues/:id",
  authMiddleware,
  requireRole("ADMIN", "ORGANIZER", "USER"),
  venueController.getById
);

// Update venue (organizer only, own venues)
venueRouter.patch(
  "/venues/:id",
  authMiddleware,
  requireRole("ORGANIZER"),
  venueController.update
);

// Delete venue (organizer only, own venues)
venueRouter.delete(
  "/venues/:id",
  authMiddleware,
  requireRole("ORGANIZER"),
  venueController.remove
);

export default venueRouter;
