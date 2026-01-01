import  prisma  from "../../config/db.js";

export const issuedTicketRepo = {
  create(tx, payload) {
    return tx.issuedTicket.create({
      data: payload,
      include: {
        ticketType: true,
        seat: true,
      },
    });
  },

  assignSeat(tx, issuedTicketId, seatId) {
    return tx.issuedTicket.update({
      where: { id: issuedTicketId },
      data: { seatId },
      include: {
        ticketType: true,
        seat: true,
      },
    });
  },

  findById(id) {
    return prisma.issuedTicket.findUnique({
      where: { id },
      include: {
        event: true,
        ticketType: true,
        seat: true,
      },
    });
  },
};
