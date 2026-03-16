import { Restaurant } from '../models/restaurantModel';
import type { CreateRestaurantInput, UpdateRestaurantInput } from '../validations/restaurantSchema';
import type { PaginationQuery } from '../validations/commonSchema';

export const createRestaurantService = async (data: CreateRestaurantInput) => {
  const restaurant = new Restaurant({
    restaurantName: data.restaurantName,
    region: data.region,
    beach: data.beach,
    phone: data.phone,
  });
  return restaurant.save();
};

export const getAllRestaurantsService = async (pagination: PaginationQuery) => {
  const { page, limit, sortBy = 'restaurantName', sortOrder } = pagination;
  const skip = (page - 1) * limit;
  const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const [data, total] = await Promise.all([
    Restaurant.find()
      .populate('region', 'regionName')
      .populate('beach', 'beachName')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Restaurant.countDocuments(),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getRestaurantByIdService = async (id: string) => {
  const restaurant = await Restaurant.findById(id)
    .populate('region', 'regionName')
    .populate('beach', 'beachName');
  if (!restaurant) throw new Error('Invalid RestaurantId. Wrong Parameter Passed');
  return restaurant;
};

export const updateRestaurantService = async (id: string, data: UpdateRestaurantInput) => {
  const restaurant = await Restaurant.findByIdAndUpdate(id, { $set: data }, { new: true })
    .populate('region', 'regionName')
    .populate('beach', 'beachName');
  if (!restaurant) throw new Error('Invalid RestaurantId. Wrong Parameter Passed');
  return restaurant;
};

export const deleteRestaurantService = async (id: string) => {
  const restaurant = await Restaurant.findByIdAndDelete(id);
  if (!restaurant) throw new Error('Invalid RestaurantId. Wrong Parameter Passed');
  return restaurant;
};
