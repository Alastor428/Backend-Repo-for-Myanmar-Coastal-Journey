import { TourGuideBooking } from '../models/tourGuideBookingModel';
import { TourGuide, TourGuideAvailability } from '../models/tourGuideModel';
import { User } from '../models/userModel';
import type { PaginationQuery } from '../validations/commonSchema';
import type {
  CreateTourGuideBookingInput,
  UpdateTourGuideBookingInput,
} from '../validations/tourGuideBookingSchema';

export function calculateDays(startDate: Date, endDate: Date): number {
  const d0 = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const d1 = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  const diffDays = Math.round((d1 - d0) / 86400000);
  if (diffDays < 1) throw new Error('Booking must be at least one day (endDate after startDate)');
  return diffDays;
}

export const createTourGuideBookingService = async (
  userId: string,
  data: CreateTourGuideBookingInput
) => {
  const user = await User.findById(userId).select('name');
  if (!user) throw new Error('User not found');

  const guide = await TourGuide.findById(data.tourGuide);
  if (!guide) throw new Error('Tour guide not found');
  if (guide.availability !== TourGuideAvailability.Available) {
    throw new Error('Tour guide is not available');
  }

  const totalDays = calculateDays(data.startDate, data.endDate);
  const currency = data.currency ?? guide.currency ?? 'MMK';
  const pricePerDay = guide.pricePerDay;
  const totalPrice = totalDays * pricePerDay;

  const booking = new TourGuideBooking({
    user: userId,
    tourGuide: data.tourGuide,
    guestName: data.guestName ?? user.name,
    startDate: data.startDate,
    endDate: data.endDate,
    totalDays,
    pricePerDay,
    currency,
    totalPrice,
  });

  const saved = await booking.save();
  return TourGuideBooking.findById(saved._id)
    .populate('user', 'name email')
    .populate('tourGuide', 'name phone languages pricePerDay currency availability beach');
};

export const getTourGuideBookingsForUserService = async (userId: string, pagination: PaginationQuery) => {
  const { page, limit, sortBy = 'createdAt', sortOrder } = pagination;
  const skip = (page - 1) * limit;
  const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const filter = { user: userId };
  const [data, total] = await Promise.all([
    TourGuideBooking.find(filter)
      .populate('user', 'name email')
      .populate('tourGuide', 'name phone languages pricePerDay currency availability beach')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    TourGuideBooking.countDocuments(filter),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getTourGuideBookingByIdService = async (id: string, userId: string) => {
  const booking = await TourGuideBooking.findOne({ _id: id, user: userId })
    .populate('user', 'name email')
    .populate('tourGuide', 'name phone languages pricePerDay currency availability beach');
  if (!booking) throw new Error('Invalid TourGuideBookingId. Wrong Parameter Passed');
  return booking;
};

export const updateTourGuideBookingService = async (
  id: string,
  userId: string,
  data: UpdateTourGuideBookingInput
) => {
  const existing = await TourGuideBooking.findOne({ _id: id, user: userId });
  if (!existing) throw new Error('Invalid TourGuideBookingId. Wrong Parameter Passed');

  let totalDays = existing.totalDays;
  let totalPrice = existing.totalPrice;

  const nextStart = data.startDate ?? existing.startDate;
  const nextEnd = data.endDate ?? existing.endDate;
  if (data.startDate || data.endDate) {
    totalDays = calculateDays(nextStart, nextEnd);
    totalPrice = totalDays * existing.pricePerDay;
  }

  const booking = await TourGuideBooking.findOneAndUpdate(
    { _id: id, user: userId },
    {
      $set: {
        ...(data.guestName !== undefined && { guestName: data.guestName }),
        ...(data.startDate !== undefined && { startDate: data.startDate }),
        ...(data.endDate !== undefined && { endDate: data.endDate }),
        ...(data.startDate || data.endDate ? { totalDays, totalPrice } : {}),
      },
    },
    { new: true }
  )
    .populate('user', 'name email')
    .populate('tourGuide', 'name phone languages pricePerDay currency availability beach');

  if (!booking) throw new Error('Invalid TourGuideBookingId. Wrong Parameter Passed');
  return booking;
};

export const confirmTourGuideBookingService = async (id: string, userId: string) => {
  const booking = await TourGuideBooking.findOne({ _id: id, user: userId });
  if (!booking) throw new Error('Invalid TourGuideBookingId. Wrong Parameter Passed');

  if (booking.status === 'Confirmed') return booking;

  booking.status = 'Confirmed';
  booking.confirmedAt = new Date();
  await booking.save();

  return TourGuideBooking.findById(booking._id)
    .populate('user', 'name email')
    .populate('tourGuide', 'name phone languages pricePerDay currency availability beach');
};

export const deleteTourGuideBookingService = async (id: string, userId: string) => {
  const booking = await TourGuideBooking.findOneAndDelete({ _id: id, user: userId });
  if (!booking) throw new Error('Invalid TourGuideBookingId. Wrong Parameter Passed');
  return booking;
};

