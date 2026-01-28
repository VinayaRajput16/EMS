import { ticketService } from "./ticketService.js";

export const ticketController = {
  async create(req, res, next) {
    try {
      const { eventId } = req.params;
      const organizerId = req.user.id;

      const ticket = await ticketService.create(
        eventId,          // ✅ FIRST
        req.body,         // ✅ SECOND
        organizerId
      );

      res.status(201).json({
        success: true,
        data: ticket,
      });
    } catch (e) {
      next(e);
    }
  },

  async getByEvent(req, res, next) {
    try {
      const tickets = await ticketService.getEventTickets(req.params.eventId);
      res.json({ success: true, data: tickets });
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const ticket = await ticketService.update(
        req.params.id,
        req.body,
        req.user.id
      );
      res.json({ success: true, data: ticket });
    } catch (e) {
      next(e);
    }
  },

  async delete(req, res, next) {
    try {
      await ticketService.delete(req.params.id, req.user.id);
      res.json({ success: true, message: "Ticket deleted" });
    } catch (e) {
      next(e);
    }
  },
};
