import { Router } from "express";
import { eventController } from "./eventController.js";
import {authMiddleware} from "../../common/middleware/authMiddleware.js";
import {requireRole} from "../../common/middleware/roleMiddleware.js";

const router = Router();

router.use(authMiddleware, requireRole("ORGANIZER"));

router.post("/", eventController.create);
router.get("/my", eventController.myEvents);
router.patch("/:id", eventController.update);
router.patch("/:id/venue", eventController.attachVenue); 
router.patch("/:id/publish", eventController.publish);
router.delete("/:id", eventController.remove);

export default router;
