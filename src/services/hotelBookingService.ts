import { Hotel } from '../models/hotelModel';
import { HotelBooking, type IHotelBookingLineItem } from '../models/hotelBookingModel';
import { Room } from '../models/roomModel';
import type {
  CreateHotelBookingInput,
  UpdateHotelBookingInput,
} from '../validations/hotelBookingSchema';
import type { PaginationQuery } from '../validations/commonSchema';

export function calculateStayNights(checkIn: Date, checkOut: Date): number {
  const d0 = Date.UTC(checkIn.getFullYear(), checkIn.getMonth(), checkIn.getDate());
  const d1 = Date.UTC(checkOut.getFullYear(), checkOut.getMonth(), checkOut.getDate());
  const diffDays = Math.round((d1 - d0) / 86400000);
  if (diffDays < 1) throw new Error('Stay must be at least one night (check-out after check-in)');
  return diffDays;
}

async function buildLineItemsFromInput(
  hotelId: string,
  lineInputs: CreateHotelBookingInput['lineItems']
): Promise<IHotelBookingLineItem[]> {
  const out: IHotelBookingLineItem[] = [];

  for (const line of lineInputs) {
    const room = await Room.findById(line.room);
    if (!room) throw new Error(`Room not found: ${line.room}`);
    if (room.hotel.toString() !== hotelId) {
      throw new Error(`Room ${line.room} does not belong to the selected hotel`);
    }

    const nights = calculateStayNights(line.checkInDate, line.checkOutDate);
    const lineTotalPrice = nights * room.roomPricePerNight * line.numberOfRooms;

    out.push({
      room: room._id,
      checkInDate: line.checkInDate,
      checkOutDate: line.checkOutDate,
      checkInTimeNote: line.checkInTimeNote ?? 'after 14:00',
      checkOutTimeNote: line.checkOutTimeNote ?? 'Before 12:00',
      numberOfRooms: line.numberOfRooms,
      numberOfAdults: line.numberOfAdults,
      lengthOfStayNights: nights,
      lineTotalPrice,
    });
  }

  return out;
}

export const createHotelBookingService = async (
  userId: string,
  data: CreateHotelBookingInput
) => {
  const hotel = await Hotel.findById(data.hotel);
  if (!hotel) throw new Error('Hotel not found');

  const lineItems = await buildLineItemsFromInput(data.hotel, data.lineItems);
  const totalPrice = lineItems.reduce((sum, li) => sum + li.lineTotalPrice, 0);

  const booking = new HotelBooking({
    user: userId,
    hotel: data.hotel,
    guestName: data.guestName,
    taxIncluded: data.taxIncluded ?? true,
    currency: data.currency ?? 'MMK',
    lineItems,
    totalPrice,
  });

  const saved = await booking.save();
  return HotelBooking.findById(saved._id)
    .populate('hotel', 'hotelName beach hotelRating')
    .populate('user', 'name email')
    .populate({ path: 'lineItems.room', select: 'roomType roomPricePerNight roomCapacity roomDescription hotel' });
};

export const getHotelBookingsForUserService = async (
  userId: string,
  pagination: PaginationQuery
) => {
  const { page, limit, sortBy = 'createdAt', sortOrder } = pagination;
  const skip = (page - 1) * limit;
  const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const filter = { user: userId };

  const [data, total] = await Promise.all([
    HotelBooking.find(filter)
      .populate('hotel', 'hotelName beach hotelRating')
      .populate({ path: 'lineItems.room', select: 'roomType roomPricePerNight roomCapacity hotel' })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    HotelBooking.countDocuments(filter),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getHotelBookingByIdService = async (id: string, userId: string) => {
  const booking = await HotelBooking.findOne({ _id: id, user: userId })
    .populate('hotel', 'hotelName beach hotelRating')
    .populate({ path: 'lineItems.room', select: 'roomType roomPricePerNight roomCapacity hotel' })
    .populate('user', 'name email');

  if (!booking) throw new Error('Invalid HotelBookingId. Wrong Parameter Passed');

  return booking;
};

export const updateHotelBookingService = async (
  id: string,
  userId: string,
  data: UpdateHotelBookingInput
) => {
  const existing = await HotelBooking.findOne({ _id: id, user: userId });
  if (!existing) throw new Error('Invalid HotelBookingId. Wrong Parameter Passed');

  let lineItems = existing.lineItems;
  let totalPrice = existing.totalPrice;

  if (data.lineItems && data.lineItems.length > 0) {
    lineItems = await buildLineItemsFromInput(existing.hotel.toString(), data.lineItems);
    totalPrice = lineItems.reduce((sum, li) => sum + li.lineTotalPrice, 0);
  }

  const booking = await HotelBooking.findOneAndUpdate(
    { _id: id, user: userId },
    {
      $set: {
        ...(data.guestName !== undefined && { guestName: data.guestName }),
        ...(data.taxIncluded !== undefined && { taxIncluded: data.taxIncluded }),
        ...(data.lineItems && data.lineItems.length > 0 && { lineItems, totalPrice }),
      },
    },
    { new: true }
  )
    .populate('hotel', 'hotelName beach hotelRating')
    .populate({ path: 'lineItems.room', select: 'roomType roomPricePerNight roomCapacity roomDescription hotel' });

  if (!booking) throw new Error('Invalid HotelBookingId. Wrong Parameter Passed');
  return booking;
};

export const confirmHotelBookingService = async (id: string, userId: string) => {
  const booking = await HotelBooking.findOne({ _id: id, user: userId });
  if (!booking) throw new Error('Invalid HotelBookingId. Wrong Parameter Passed');

  if (booking.status === 'Confirmed') return booking;

  booking.status = 'Confirmed';
  booking.confirmedAt = new Date();
  await booking.save();

  return HotelBooking.findById(booking._id)
    .populate('hotel', 'hotelName beach hotelRating')
    .populate('user', 'name email')
    .populate({ path: 'lineItems.room', select: 'roomType roomPricePerNight roomCapacity roomDescription hotel' });
};

export const deleteHotelBookingService = async (id: string, userId: string) => {
  const booking = await HotelBooking.findOneAndDelete({ _id: id, user: userId });
  if (!booking) throw new Error('Invalid HotelBookingId. Wrong Parameter Passed');
  return booking;
};
