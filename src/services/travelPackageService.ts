import { TravelPackage } from '../models/travelPackageModel';
import { City } from '../models/cityModel';
import { Beach } from '../models/beachModel';
import type { PaginationQuery } from '../validations/commonSchema';
import type {
  CreateTravelPackageInput,
  UpdateTravelPackageInput,
  SearchTravelPackagesQuery,
} from '../validations/travelPackageSchema';

export const createTravelPackageService = async (data: CreateTravelPackageInput) => {
  const pkg = new TravelPackage({
    packageName: data.packageName,
    fromCity: data.fromCity,
    toBeach: data.toBeach,
    departOnDate: data.departOnDate,
    departureTime: data.departureTime,
    busTicket: data.busTicket,
    hotel: data.hotel,
    transfers: data.transfers,
    currency: data.currency ?? 'MMK',
    isActive: data.isActive ?? true,
    // pricePerPerson will be computed in pre-validate hook
    pricePerPerson: 0,
  });
  return pkg.save();
};

export const searchTravelPackagesService = async (
  query: SearchTravelPackagesQuery,
  pagination: PaginationQuery
) => {
  const { page, limit, sortBy = 'pricePerPerson', sortOrder } = pagination;
  const skip = (page - 1) * limit;
  const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const [fromCity, toBeach] = await Promise.all([
    City.findOne({ cityName: { $regex: `^${query.from}$`, $options: 'i' } }).select('_id'),
    Beach.findOne({ beachName: { $regex: `^${query.to}$`, $options: 'i' } }).select('_id'),
  ]);

  if (!fromCity || !toBeach) {
    return { data: [], total: 0, page, limit, totalPages: 0 };
  }

  const start = new Date(query.departOnDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  const filter = {
    isActive: true,
    fromCity: fromCity._id,
    toBeach: toBeach._id,
    departOnDate: { $gte: start, $lt: end },
  };

  const [data, total] = await Promise.all([
    TravelPackage.find(filter)
      .populate('fromCity', 'cityName')
      .populate('toBeach', 'beachName')
      .populate('busTicket.ticket')
      .populate('hotel.hotel', 'hotelName beach hotelRating')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    TravelPackage.countDocuments(filter),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getTravelPackageByIdService = async (id: string) => {
  const pkg = await TravelPackage.findById(id)
    .populate('fromCity', 'cityName')
    .populate('toBeach', 'beachName')
    .populate('busTicket.ticket')
    .populate('hotel.hotel', 'hotelName beach hotelRating');
  if (!pkg) throw new Error('Invalid TravelPackageId. Wrong Parameter Passed');
  return pkg;
};

export const updateTravelPackageService = async (id: string, data: UpdateTravelPackageInput) => {
  const pkg = await TravelPackage.findById(id);
  if (!pkg) throw new Error('Invalid TravelPackageId. Wrong Parameter Passed');

  // merge nested objects carefully
  if (data.busTicket) pkg.busTicket = { ...pkg.busTicket, ...data.busTicket } as any;
  if (data.hotel) pkg.hotel = { ...pkg.hotel, ...data.hotel } as any;
  if (data.transfers) pkg.transfers = { ...pkg.transfers, ...data.transfers } as any;

  const topLevel: Record<string, unknown> = { ...data };
  delete topLevel.busTicket;
  delete topLevel.hotel;
  delete topLevel.transfers;
  Object.assign(pkg as any, topLevel);

  const saved = await pkg.save();
  return TravelPackage.findById(saved._id)
    .populate('fromCity', 'cityName')
    .populate('toBeach', 'beachName')
    .populate('busTicket.ticket')
    .populate('hotel.hotel', 'hotelName beach hotelRating');
};

export const deleteTravelPackageService = async (id: string) => {
  const pkg = await TravelPackage.findByIdAndDelete(id);
  if (!pkg) throw new Error('Invalid TravelPackageId. Wrong Parameter Passed');
  return pkg;
};

