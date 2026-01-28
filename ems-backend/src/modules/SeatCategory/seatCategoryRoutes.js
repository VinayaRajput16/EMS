import { Router } from "express";
import { seatCategoryController } from "./seatCategoryController.js";
import { authMiddleware } from "../../common/middleware/authMiddleware.js";
import { requireRole } from "../../common/middleware/roleMiddleware.js";

const router = Router();

router.post(
  "/events/:eventId/seat-categories",
  authMiddleware,
  requireRole("ORGANIZER"),
  seatCategoryController.create
);

router.get(
  "/events/:eventId/seat-categories",
  authMiddleware,
  requireRole("ORGANIZER"),
  seatCategoryController.list
);

export default router;
