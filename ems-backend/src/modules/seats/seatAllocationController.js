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

  // ADD THIS NEW FUNCTION
  async getEventSeats(req, res, next) {
    try {
      const { eventId } = req.params;
      const organizerId = req.user.id;
      
      const seats = await seatAllocationService.getEventSeatsForOrganizer(eventId, organizerId);
      res.json({ success: true, data: seats });
    } catch (e) {
      next(e);
    }
  },
  async getAvailableSeats(req, res, next) {
  try {
    const { eventId } = req.params;
    
    const seats = await seatAllocationService.getAvailableSeatsForEvent(eventId);
    res.json({ success: true, data: seats });
  } catch (e) {
    next(e);
  }
},
};
