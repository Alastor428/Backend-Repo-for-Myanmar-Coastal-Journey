import { Bus } from '../models/busModel';
import { City } from '../models/cityModel';
import { Beach } from '../models/beachModel';
import { Route } from '../models/routeModel';
import type { CreateBusInput, UpdateBusInput, FilterBusByDepartureQuery, FilterBusBySourceDestinationQuery } from '../validations/busSchema';
import type { PaginationQuery } from '../validations/commonSchema';

const busPopulate = [
  {
    path: 'route',
    select: 'source destination duration',
    populate: [
      { path: 'source', select: 'cityName' },
      { path: 'destination', select: 'beachName' },
    ],
  },
];

export const createBusService = async (data: CreateBusInput) => {
  const bus = new Bus({
    route: data.route,
    noOfSeats: data.noOfSeats,
    departureTime: data.departureTime,
    isAvailable: data.isAvailable,
  });
  return bus.save();
};

export const getAllBusesService = async (pagination: PaginationQuery) => {
  const { page, limit, sortBy = 'departureTime', sortOrder } = pagination;
  const skip = (page - 1) * limit;
  const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const [data, total] = await Promise.all([
    Bus.find()
      .populate(busPopulate)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('noOfSeats departureTime isAvailable route')
      .lean(),
    Bus.countDocuments(),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getBusByIdService = async (id: string) => {
  const bus = await Bus.findById(id)
    .populate(busPopulate)
    .select('-createdAt -updatedAt -__v');
  if (!bus) throw new Error('Invalid BusId. Wrong Parameter Passed');
  return bus;
};

export const updateBusService = async (id: string, data: UpdateBusInput) => {
  const bus = await Bus.findByIdAndUpdate(id, { $set: data }, { new: true })
    .populate(busPopulate)
    .select('-createdAt -updatedAt -__v');
  if (!bus) throw new Error('Invalid BusId. Wrong Parameter Passed');
  return bus;
};

export const deleteBusService = async (id: string) => {
  const bus = await Bus.findByIdAndDelete(id);
  if (!bus) throw new Error('Invalid BusId. Wrong Parameter Passed');
  return bus;
};

export const filterBusesByDepartureService = async (
  query: FilterBusByDepartureQuery,
  pagination: PaginationQuery
) => {
  const { page, limit, sortBy = 'departureTime', sortOrder } = pagination;
  const skip = (page - 1) * limit;
  const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const [data, total] = await Promise.all([
    Bus.find({
      departureTime: query.departureTime,
      isAvailable: query.isAvailable,
    })
      .populate(busPopulate)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-createdAt -updatedAt -__v')
      .lean(),
    Bus.countDocuments({
      departureTime: query.departureTime,
      isAvailable: query.isAvailable,
    }),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const filterBusesBySourceDestinationService = async (
  query: FilterBusBySourceDestinationQuery,
  pagination: PaginationQuery
) => {
  const city = await City.findOne({ cityName: query.source });
  const beach = await Beach.findOne({ beachName: query.destination });
  if (!city || !beach) throw new Error('Source or Destination Not Found');

  const route = await Route.findOne({
    source: city._id,
    destination: beach._id,
  } as Record<string, unknown>);
  if (!route) throw new Error('No route found between source and destination');

  const routeId = route._id;
  const { page, limit, sortBy = 'departureTime', sortOrder } = pagination;
  const skip = (page - 1) * limit;
  const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const [data, total] = await Promise.all([
    Bus.find({ route: routeId })
      .populate(busPopulate)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-createdAt -updatedAt -__v')
      .lean(),
    Bus.countDocuments({ route: routeId }),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
