import { Router } from "express";
import { seatAllocationController } from "./seatAllocationController.js";
import { authMiddleware } from "../../common/middleware/authMiddleware.js";
import { requireRole } from "../../common/middleware/roleMiddleware.js";

const seatAllocationRouter = Router();

// User buys a ticket (issue + optional auto seat)
seatAllocationRouter.post(
  "/events/:eventId/tickets/issue",
  authMiddleware,
  requireRole("USER", "ORGANIZER"),
  (req, res, next) => {
    req.body.eventId = req.params.eventId;
    seatAllocationController.issueTicket(req, res, next);
  }
);


// Organizer assigns / changes seat manually
seatAllocationRouter.post(
  "/issued-tickets/:id/assign-seat",
  authMiddleware,
  requireRole("ORGANIZER"),
  seatAllocationController.assignSeat
);

export default seatAllocationRouter;
