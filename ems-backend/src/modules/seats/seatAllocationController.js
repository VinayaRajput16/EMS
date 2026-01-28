import { seatAllocationService } from "./seatAllocationService.js";

export const seatAllocationController = {
  async allocate(req, res, next) {
    try {
      res.status(400).json({
        message:
          "Seat allocation is handled automatically during order processing.",
      });
    } catch (e) {
      next(e);
    }
  },
};
