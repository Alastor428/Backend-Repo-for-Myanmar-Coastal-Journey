import { TravelPackage } from '../models/travelPackageModel';
import {
  TravelPackageBooking,
  TravelPaymentMethod,
  type ITravelPaymentReceipt,
} from '../models/travelPackageBookingModel';
import { User } from '../models/userModel';
import type { PaginationQuery } from '../validations/commonSchema';
import type {
  CreateTravelPackageBookingInput,
  ConfirmTravelPaymentInput,
} from '../validations/travelPackageBookingSchema';

function maskRecipient(last4: string): string {
  return `****${last4}`;
}

function generateInvoiceNumber(): string {
  // 10 digits, like in the screenshot
  return Math.floor(1_000_000_000 + Math.random() * 9_000_000_000).toString();
}

function generateTransactionNo(): string {
  return Math.floor(1_000_000_000 + Math.random() * 9_000_000_000).toString();
}

export const createTravelPackageBookingService = async (
  userId: string,
  data: CreateTravelPackageBookingInput
) => {
  const pkg = await TravelPackage.findById(data.travelPackage)
    .populate('fromCity', 'cityName')
    .populate('toBeach', 'beachName');
  if (!pkg || !pkg.isActive) throw new Error('Travel package not found');

  const numberOfPeople = data.numberOfPeople ?? 1;
  const pricePerPerson = pkg.pricePerPerson;
  const totalPrice = pricePerPerson * numberOfPeople;

  const booking = new TravelPackageBooking({
    user: userId,
    travelPackage: pkg._id,
    numberOfPeople,
    currency: pkg.currency,
    pricePerPerson,
    totalPrice,
  });

  const saved = await booking.save();
  return TravelPackageBooking.findById(saved._id)
    .populate('user', 'name email nrc passport')
    .populate({
      path: 'travelPackage',
      populate: [
        { path: 'fromCity', select: 'cityName' },
        { path: 'toBeach', select: 'beachName' },
        { path: 'busTicket.ticket' },
        { path: 'hotel.hotel', select: 'hotelName beach hotelRating' },
      ],
    });
};

export const getTravelPackageBookingsForUserService = async (
  userId: string,
  pagination: PaginationQuery
) => {
  const { page, limit, sortBy = 'createdAt', sortOrder } = pagination;
  const skip = (page - 1) * limit;
  const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const filter = { user: userId };
  const [data, total] = await Promise.all([
    TravelPackageBooking.find(filter)
      .populate('user', 'name email nrc passport')
      .populate({
        path: 'travelPackage',
        populate: [
          { path: 'fromCity', select: 'cityName' },
          { path: 'toBeach', select: 'beachName' },
          { path: 'busTicket.ticket' },
          { path: 'hotel.hotel', select: 'hotelName beach hotelRating' },
        ],
      })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    TravelPackageBooking.countDocuments(filter),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getTravelPackageBookingByIdService = async (id: string, userId: string) => {
  const booking = await TravelPackageBooking.findOne({ _id: id, user: userId })
    .populate('user', 'name email nrc passport')
    .populate({
      path: 'travelPackage',
      populate: [
        { path: 'fromCity', select: 'cityName' },
        { path: 'toBeach', select: 'beachName' },
        { path: 'busTicket.ticket' },
        { path: 'hotel.hotel', select: 'hotelName beach hotelRating' },
      ],
    });
  if (!booking) throw new Error('Invalid TravelPackageBookingId. Wrong Parameter Passed');
  return booking;
};

export const confirmTravelPaymentService = async (
  id: string,
  userId: string,
  data: ConfirmTravelPaymentInput
) => {
  const booking = await TravelPackageBooking.findOne({ _id: id, user: userId }).populate(
    'travelPackage'
  );
  if (!booking) throw new Error('Invalid TravelPackageBookingId. Wrong Parameter Passed');
  if (booking.status === 'Paid') return booking;

  const user = await User.findById(userId).select('name nrc passport');
  if (!user) throw new Error('User not found');

  // If card input passes validation, we treat it as "valid".
  const last4 = (data.recipientLast4 ?? data.cardNumber.slice(-4)).toString();

  const pkg = booking.travelPackage as any;
  const travelDate = pkg.departOnDate ?? new Date();
  const departureTime = pkg.departureTime ?? '08:30 AM';
  const purchaseSeat = 'K1';

  const receipt: ITravelPaymentReceipt = {
    productDescription: pkg.packageName ?? 'Travel package',
    invoiceNumber: generateInvoiceNumber(),
    amount: booking.totalPrice,
    recipientMasked: maskRecipient(last4),
    transactionTime: new Date(),
    transactionNo: generateTransactionNo(),
    transactionTo: 'Wave Way',
    totalAmount: booking.totalPrice,
    travelDate,
    departureTime,
    purchaseSeat,
    paymentMethod: data.paymentMethod,
    nrcNumber: (user as any).nrc ?? (user as any).passport,
    userName: (user as any).name,
  };

  booking.status = 'Paid';
  booking.paymentMethod = data.paymentMethod as unknown as TravelPaymentMethod;
  booking.paidAt = new Date();
  booking.receipt = receipt;
  await booking.save();

  return TravelPackageBooking.findById(booking._id)
    .populate('user', 'name email nrc passport')
    .populate({
      path: 'travelPackage',
      populate: [
        { path: 'fromCity', select: 'cityName' },
        { path: 'toBeach', select: 'beachName' },
        { path: 'busTicket.ticket' },
        { path: 'hotel.hotel', select: 'hotelName beach hotelRating' },
      ],
    });
};

