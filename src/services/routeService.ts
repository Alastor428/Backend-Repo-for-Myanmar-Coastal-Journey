import { Route } from '../models/routeModel';
import type { CreateRouteInput, UpdateRouteInput } from '../validations/routeSchema';
import type { PaginationQuery } from '../validations/commonSchema';

export const createRouteService = async (data: CreateRouteInput) => {
  const route = new Route({
    source: data.source,
    destination: data.destination,
    duration: data.duration,
    distance: data.distance,
  });
  return route.save();
};

export const getAllRoutesService = async (pagination: PaginationQuery) => {
  const { page, limit, sortBy = 'source', sortOrder } = pagination;
  const skip = (page - 1) * limit;
  const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const [data, total] = await Promise.all([
    Route.find()
      .populate('source', 'cityName')
      .populate('destination', 'beachName')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-createdAt -updatedAt -__v')
      .lean(),
    Route.countDocuments(),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getRouteByIdService = async (id: string) => {
  const route = await Route.findById(id)
    .populate('source', 'cityName')
    .populate('destination', 'beachName');
  if (!route) throw new Error('Invalid RouteId. Wrong Parameter Passed');
  return route;
};

export const updateRouteService = async (id: string, data: UpdateRouteInput) => {
  const route = await Route.findByIdAndUpdate(id, { $set: data }, { new: true })
    .populate('source', 'cityName')
    .populate('destination', 'beachName');
  if (!route) throw new Error('Invalid RouteId. Wrong Parameter Passed');
  return route;
};

export const deleteRouteService = async (id: string) => {
  const route = await Route.findByIdAndDelete(id);
  if (!route) throw new Error('Invalid RouteId. Wrong Parameter Passed');
  return route;
};
