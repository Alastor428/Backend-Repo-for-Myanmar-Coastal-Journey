import { Types } from 'mongoose';
import { Show, seatStatus, type IBusShow } from '../models/busBookingShowModel';

export const BOOKING_CURRENCY = 'MMK' as const;

export type SeatBookingSummary = {
  selectedSeatIds: string[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: typeof BOOKING_CURRENCY;
};

function findSeatRef(
  layout: IBusShow['seatLayout'],
  seatId: string
): { rowIndex: number; seatIndex: number } | null {
  for (let r = 0; r < layout.length; r++) {
    const seats = layout[r].seats;
    for (let s = 0; s < seats.length; s++) {
      if (seats[s].number === seatId) return { rowIndex: r, seatIndex: s };
    }
  }
  return null;
}

function collectSelectedSeatIdsForUser(
  layout: IBusShow['seatLayout'],
  userId: string
): string[] {
  const ids: string[] = [];
  for (const row of layout) {
    for (const seat of row.seats) {
      if (seat.status === seatStatus.Selected && seat.selectedBy?.toString() === userId) {
        ids.push(seat.number);
      }
    }
  }
  return ids.sort();
}

export function buildBookingSummaryForUser(show: IBusShow, userId: string): SeatBookingSummary {
  const selectedSeatIds = collectSelectedSeatIdsForUser(show.seatLayout, userId);
  const quantity = selectedSeatIds.length;
  const unitPrice = show.price;
  return {
    selectedSeatIds,
    quantity,
    unitPrice,
    totalPrice: quantity * unitPrice,
    currency: BOOKING_CURRENCY,
  };
}

export const toggleSeatsSelectionService = async (
  showId: string,
  userId: string,
  seatIds: string[]
) => {
  const show = await Show.findById(showId);
  if (!show) throw new Error('Invalid Bus ShowId. Wrong Parameter Passed');

  const uid = new Types.ObjectId(userId);

  for (const seatId of seatIds) {
    const pos = findSeatRef(show.seatLayout, seatId);
    if (!pos) throw new Error(`Seat ${seatId} not found`);

    const seat = show.seatLayout[pos.rowIndex].seats[pos.seatIndex];

    if (seat.status === seatStatus.Unavailable) {
      throw new Error(`Seat ${seatId} is unavailable`);
    }

    if (seat.status === seatStatus.Available) {
      seat.status = seatStatus.Selected;
      seat.selectedBy = uid;
      continue;
    }

    if (seat.status === seatStatus.Selected) {
      const owner = seat.selectedBy?.toString();
      if (owner && owner !== userId) {
        throw new Error(`Seat ${seatId} is already selected by another user`);
      }
      seat.status = seatStatus.Available;
      seat.selectedBy = undefined;
    }
  }

  show.markModified('seatLayout');
  await show.save();

  const populated = await Show.findById(showId).populate('bus').populate('ticket');
  if (!populated) throw new Error('Invalid Bus ShowId. Wrong Parameter Passed');

  const booking = buildBookingSummaryForUser(populated, userId);

  return { show: populated, booking };
};

/**
 * After successful payment: mark seats as Unavailable so other users see them as taken.
 * Only seats currently Selected by this user can be confirmed.
 */
export const confirmSeatsAfterPaymentService = async (
  showId: string,
  userId: string,
  seatIds: string[]
) => {
  const show = await Show.findById(showId);
  if (!show) throw new Error('Invalid Bus ShowId. Wrong Parameter Passed');

  for (const seatId of seatIds) {
    const pos = findSeatRef(show.seatLayout, seatId);
    if (!pos) throw new Error(`Seat ${seatId} not found`);

    const seat = show.seatLayout[pos.rowIndex].seats[pos.seatIndex];

    if (seat.status !== seatStatus.Selected) {
      throw new Error(`Seat ${seatId} must be selected before booking`);
    }
    if (seat.selectedBy?.toString() !== userId) {
      throw new Error(`Seat ${seatId} is not in your selection`);
    }

    seat.status = seatStatus.Unavailable;
    seat.selectedBy = undefined;
  }

  show.markModified('seatLayout');
  await show.save();

  const populated = await Show.findById(showId).populate('bus').populate('ticket');
  if (!populated) throw new Error('Invalid Bus ShowId. Wrong Parameter Passed');

  const quantity = seatIds.length;
  const unitPrice = populated.price;
  const booking: SeatBookingSummary = {
    selectedSeatIds: [...seatIds].sort(),
    quantity,
    unitPrice,
    totalPrice: quantity * unitPrice,
    currency: BOOKING_CURRENCY,
  };

  return { show: populated, booking };
};
