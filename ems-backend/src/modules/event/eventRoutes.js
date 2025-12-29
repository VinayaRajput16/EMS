import { Router } from "express";
import { eventController } from "./eventController.js";
import authMiddleware from "../../common/middleware/authMiddleware.js";
import roleMiddleware from "../../common/middleware/roleMiddleware.js";

const router = Router();

router.use(authMiddleware, roleMiddleware("ORGANIZER"));

router.post("/", eventController.create);
router.get("/my", eventController.myEvents);
router.patch("/:id", eventController.update);
router.patch("/:id/publish", eventController.publish);
router.delete("/:id", eventController.remove);

export default router;
