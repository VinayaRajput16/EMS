import { Router } from "express";
import { eventController } from "./eventController.js";
import { authMiddleware } from "../../common/middleware/authMiddleware.js";
import { requireRole } from "../../common/middleware/roleMiddleware.js";

const router = Router();

// ========== PUBLIC ROUTES (NO AUTH) - MUST BE FIRST ==========
router.get("/public/all", eventController.getAllPublished);
router.get("/public/:id", eventController.getPublicEventDetails);

// ========== ORGANIZER ROUTES (AUTH REQUIRED) ==========
router.post("/", authMiddleware, requireRole("ORGANIZER"), eventController.create);
router.get("/my", authMiddleware, requireRole("ORGANIZER"), eventController.myEvents);
router.patch("/:id", authMiddleware, requireRole("ORGANIZER"), eventController.update);
router.patch("/:id/publish", authMiddleware, requireRole("ORGANIZER"), eventController.publish);
router.delete("/:id", authMiddleware, requireRole("ORGANIZER"), eventController.remove);
router.get("/:id", authMiddleware, requireRole("ORGANIZER"), eventController.getEvent);

export default router;