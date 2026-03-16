import mongoose from 'mongoose';
import { Food } from '../models/foodModel';
import { Restaurant } from '../models/restaurantModel';
import type { CreateFoodInput, FilterFoodQuery, UpdateFoodInput } from '../validations/foodSchema';
import type { PaginationQuery } from '../validations/commonSchema';

export const createFoodService = async (data: CreateFoodInput) => {
  const food = new Food({
    restaurant: data.restaurant,
    foodName: data.foodName,
    foodPrice: data.foodPrice,
  });
  return food.save();
};

export const getFoodsByRestaurantIdService = async (restaurantId: string, pagination: PaginationQuery) => {
  const { page, limit, sortBy = 'foodPrice', sortOrder } = pagination;
  const skip = (page - 1) * limit;
  const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const restaurantObjId = new mongoose.Types.ObjectId(restaurantId);
  const [data, total] = await Promise.all([
    Food.find({ restaurant: restaurantObjId })
      .populate('restaurant', 'restaurantName')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-createdAt -updatedAt -__v')
      .lean(),
    Food.countDocuments({ restaurant: restaurantObjId }),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const filterFoodsByRestaurantNameService = async (query: FilterFoodQuery, pagination: PaginationQuery) => {
  const restaurant = await Restaurant.findOne({ restaurantName: query.restaurantName });
  if (!restaurant) throw new Error('Restaurant Not Found');

  const { page, limit, sortBy = 'foodPrice', sortOrder } = pagination;
  const skip = (page - 1) * limit;
  const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const [data, total] = await Promise.all([
    Food.find({ restaurant: restaurant._id })
      .populate('restaurant', 'restaurantName')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-createdAt -updatedAt -__v')
      .lean(),
    Food.countDocuments({ restaurant: restaurant._id }),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getFoodByIdService = async (id: string) => {
  const food = await Food.findById(id).populate('restaurant', 'restaurantName');
  if (!food) throw new Error('Invalid FoodId. Wrong Parameter Passed');
  return food;
};

export const updateFoodService = async (id: string, data: UpdateFoodInput) => {
  const food = await Food.findByIdAndUpdate(id, { $set: data }, { new: true })
    .populate('restaurant', 'restaurantName');
  if (!food) throw new Error('Invalid FoodId. Wrong Parameter Passed');
  return food;
};

export const deleteFoodService = async (id: string) => {
  const food = await Food.findByIdAndDelete(id);
  if (!food) throw new Error('Invalid FoodId. Wrong Parameter Passed');
  return food;
};
