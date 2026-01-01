import { orderService } from "./orderService.js";

export const orderController = {
  async book(req, res, next) {
    try {
      const order = await orderService.book(req.body, req.user.id);
      res.status(201).json({ success: true, data: order });
    } catch (e) {
      next(e);
    }
  },

  async getMyBookings(req, res, next) {
    try {
      const orders = await orderService.getMyBookings(req.user.id);
      res.json({ success: true, data: orders });
    } catch (e) {
      next(e);
    }
  },

  async getDetails(req, res, next) {
    try {
      const order = await orderService.getBookingDetails(
        req.params.id,
        req.user.id
      );
      res.json({ success: true, data: order });
    } catch (e) {
      next(e);
    }
  },

  async cancel(req, res, next) {
    try {
      const order = await orderService.cancelBooking(req.params.id, req.user.id);
      res.json({ success: true, data: order });
    } catch (e) {
      next(e);
    }
  },
};
