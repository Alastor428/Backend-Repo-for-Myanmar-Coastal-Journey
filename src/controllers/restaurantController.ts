import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createRestaurantService,
  getAllRestaurantsService,
  getRestaurantByIdService,
  updateRestaurantService,
  deleteRestaurantService,
} from '../services/restaurantService';
import { parsePagination } from '../validations/commonSchema';

export const createRestaurant = asyncHandler(async (req: Request, res: Response) => {
  const savedRestaurant = await createRestaurantService(req.body);
  res.status(201).json({
    success: true,
    status: 201,
    message: 'Restaurant Created Successfully',
    data: savedRestaurant,
  });
});

export const getAllRestaurants = asyncHandler(async (req: Request, res: Response) => {
  const pagination = parsePagination(req.query);
  const result = await getAllRestaurantsService(pagination);

  res.status(200).json({
    success: true,
    status: 200,
    message: 'Restaurant Displayed',
    ...result,
  });
});

export const getRestaurantById = asyncHandler(async (req: Request, res: Response) => {
  const restaurant = await getRestaurantByIdService(req.params.id);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Restaurant Data Displayed',
    data: restaurant,
  });
});

export const updateRestaurant = asyncHandler(async (req: Request, res: Response) => {
  const restaurant = await updateRestaurantService(req.params.id, req.body);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Restaurant Updated Successfully',
    data: restaurant,
  });
});

export const deleteRestaurant = asyncHandler(async (req: Request, res: Response) => {
  await deleteRestaurantService(req.params.id);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Restaurant Deleted Successfully',
  });
});
