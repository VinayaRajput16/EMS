import { Router } from "express";
import { layoutController } from "./layoutController.js";
import { authMiddleware } from "../../common/middleware/authMiddleware.js";
import { requireRole } from "../../common/middleware/roleMiddleware.js";

const router = Router();

// everyone must be authenticated
router.use(authMiddleware);

// ADMIN only (write)
router.post("/layouts", requireRole("ADMIN"), layoutController.create);
router.patch("/layouts/:id", requireRole("ADMIN"), layoutController.update);
router.delete("/layouts/:id", requireRole("ADMIN"), layoutController.remove);

// ADMIN + ORGANIZER (read-only)
router.get(
  "/layouts",
  requireRole("ADMIN", "ORGANIZER"),
  layoutController.list
);

router.get(
  "/layouts/:id",
  requireRole("ADMIN", "ORGANIZER"),
  layoutController.get
);

export default router;
