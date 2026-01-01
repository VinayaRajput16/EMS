import { seatAllocationService } from "./seatAllocationService.js";

export const seatAllocationController = {
  async issueTicket(req, res, next) {
    try {
      const ticket = await seatAllocationService.issueTicketWithAllocation(
        req.body,
        req.user.id
      );
      res.status(201).json({ success: true, data: ticket });
    } catch (e) {
      next(e);
    }
  },

  async assignSeat(req, res, next) {
    try {
      const ticket = await seatAllocationService.assignSeatManually(
        req.params.id,
        req.body.seatId,
        req.user.id
      );
      res.json({ success: true, data: ticket });
    } catch (e) {
      next(e);
    }
  },
};
