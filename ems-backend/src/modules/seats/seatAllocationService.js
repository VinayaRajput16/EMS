
/**
 * Allocate N seats for an order
 * Must be called INSIDE a Prisma transaction
 */
export async function seatAllocationService({
  tx,
  eventId,
  quantity,
  orderId
}) {
  // 1. Fetch available seats in deterministic order
  const availableSeats = await tx.seat.findMany({
    where: {
      eventId,
      status: "AVAILABLE"
    },
    orderBy: [
      { row: "asc" },
      { number: "asc" }
    ]
  });

  if (availableSeats.length < quantity) {
    throw new Error("Not enough seats available");
  }

  // 2. Try to find contiguous seats (same row)
  let selectedSeats = [];

  let currentRow = [];
  for (const seat of availableSeats) {
    if (
      currentRow.length === 0 ||
      seat.row === currentRow[0].row &&
      seat.number === currentRow[currentRow.length - 1].number + 1
    ) {
      currentRow.push(seat);
    } else {
      currentRow = [seat];
    }

    if (currentRow.length === quantity) {
      selectedSeats = currentRow;
      break;
    }
  }

  // 3. Fallback: first N available seats
  if (selectedSeats.length === 0) {
    selectedSeats = availableSeats.slice(0, quantity);
  }

  // 4. Lock seats atomically
  for (const seat of selectedSeats) {
    const updated = await tx.seat.updateMany({
      where: {
        id: seat.id,
        status: "AVAILABLE"
      },
      data: {
        status: "HELD",
        orderId
      }
    });

    if (updated.count === 0) {
      throw new Error("Seat allocation conflict, please retry");
    }
  }

  return selectedSeats;
}

