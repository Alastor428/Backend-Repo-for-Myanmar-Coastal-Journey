import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createFoodService,
  getFoodsByRestaurantIdService,
  filterFoodsByRestaurantNameService,
  getFoodByIdService,
  updateFoodService,
  deleteFoodService,
} from '../services/foodService';
import { parsePagination } from '../validations/commonSchema';

export const createFood = asyncHandler(async (req: Request, res: Response) => {
  const savedFood = await createFoodService(req.body);
  res.status(201).json({
    success: true,
    status: 201,
    message: 'Food Created Successfully',
    data: savedFood,
  });
});

export const getFoodByRestaurantId = asyncHandler(async (req: Request, res: Response) => {
  const pagination = parsePagination(req.query);
  const result = await getFoodsByRestaurantIdService(req.params.id, pagination);

  res.status(200).json({
    success: true,
    status: 200,
    message: 'Food Displayed By Restaurant Id',
    ...result,
  });
});

export const filterFoodByRestaurant = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as { restaurantName: string; page: number; limit: number; sortBy?: string; sortOrder?: 'asc' | 'desc' };
  const result = await filterFoodsByRestaurantNameService(
    { restaurantName: query.restaurantName },
    { page: query.page ?? 1, limit: query.limit ?? 10, sortBy: query.sortBy, sortOrder: query.sortOrder ?? 'asc' }
  );

  res.status(200).json({
    success: true,
    status: 200,
    message: 'Filtered Foods Successfully',
    ...result,
  });
});

export const getFoodById = asyncHandler(async (req: Request, res: Response) => {
  const food = await getFoodByIdService(req.params.id);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Food Data Displayed',
    data: food,
  });
});

export const updateFood = asyncHandler(async (req: Request, res: Response) => {
  const food = await updateFoodService(req.params.id, req.body);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Food Updated Successfully',
    data: food,
  });
});

export const deleteFood = asyncHandler(async (req: Request, res: Response) => {
  await deleteFoodService(req.params.id);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Food Deleted Successfully',
  });
});
