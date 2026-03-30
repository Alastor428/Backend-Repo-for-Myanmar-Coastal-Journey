import { Types } from 'mongoose';
import { generateSeatLayout } from '../lib/busSeatIndex';
import { Show, seatStatus } from '../models/busBookingShowModel';
import { Bus } from '../models/busModel';
import { Ticket } from '../models/busTicketModel';
import type { CreateBusShowInput, UpdateBusShowInput } from '../validations/busShowSchema';

export const createBusShowService = async (data: CreateBusShowInput) => {
  const targetTicket = await Ticket.findById(data.ticket);
  if (!targetTicket) throw new Error('Ticket not found');

  const targetBus = await Bus.findById(data.busId);
  if (!targetBus) throw new Error('Bus not found');

  const seatLayout = generateSeatLayout(targetTicket.ticketPrice);

  return Show.create({
    bus: targetBus._id,
    ticket: targetTicket._id,
    departureTime: data.departureTime ?? targetBus.departureTime,
    price: targetTicket.ticketPrice,
    seatLayout,
  });
};

export const getBusShowByIdService = async (id: string) => {
  const show = await Show.findById(id)
    .populate('bus')
    .populate('ticket');
  if (!show) throw new Error('Invalid Bus ShowId. Wrong Parameter Passed');
  return show;
};

export const getAllBusShowsService = async () => {
  return Show.find()
    .sort({ createdAt: -1 })
    .populate('bus')
    .populate('ticket');
};

export const updateSeatService = async (
  showId: string,
  row: string,
  seatNumber: string,
  status: seatStatus
) => {
  const updateDoc: Record<string, unknown> = {
    $set: {
      "seatLayout.$[r].seats.$[s].status": status,
    },
  };
  if (status !== seatStatus.Selected) {
    updateDoc.$unset = {
      "seatLayout.$[r].seats.$[s].selectedBy": "",
    };
  }

  const result = await Show.updateOne(
    {
      _id: new Types.ObjectId(showId),
      "seatLayout.row": row,
      "seatLayout.seats.number": seatNumber,
    },
    updateDoc,
    {
      arrayFilters: [
        { "r.row": row },
        { "s.number": seatNumber },
      ],
    }
  );

  if (result.matchedCount === 0) throw new Error('Seat or show not found');
  return Show.findById(showId).populate('bus').populate('ticket');
};

export const updateBusShowService = async (id: string, data: UpdateBusShowInput) => {
  const show = await Show.findByIdAndUpdate(id, { $set: data }, { new: true })
    .populate('bus')
    .populate('ticket');
  if (!show) throw new Error('Invalid Bus ShowId. Wrong Parameter Passed');
  return show;
};

export const deleteBusShowService = async (id: string) => {
  const show = await Show.findByIdAndDelete(id);
  if (!show) throw new Error('Invalid Bus ShowId. Wrong Parameter Passed');
  return show;
};

// format :

// {
//   "_id": "123456",
//   "bus": "busID",
//   "ticket": "ticketID",
//   "departureTime": "10:00 AM",
//   "price": 15000,
//   "seatLayout": [
//     {
//       "row": "A",
//       "seats": [
//         { "number": "1", "status": "Available" },
//         { "number": "2", "status": "Selected" },
//         { "number": "3", "status": "Unavailable" }
//       ]
//     },
//     {
//       "row": "B",
//       "seats": [
//         { "number": "1", "status": "Available" },
//         { "number": "2", "status": "Available" }
//       ]
//     }
//   ]
// }
