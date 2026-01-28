import { Router } from "express";
import { seatAllocationController } from "./seatAllocationController.js";

const router = Router();

// ⚠️ Disabled in MVP
router.post(
  "/events/:eventId/seats/allocate",
  seatAllocationController.allocate
);

export default router;
