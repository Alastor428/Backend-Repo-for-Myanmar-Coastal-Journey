import * as z from 'zod';
import { objectIdSchema, paginationQuerySchema } from './commonSchema';

export const createFoodSchema = z.object({
  restaurant: objectIdSchema,
  foodName: z.string().min(1, 'Food name is required'),
  foodPrice: z.number().positive('Food price must be positive'),
});

export const getFoodByRestaurantParamsSchema = z.object({
  id: objectIdSchema, // restaurant id
});

export const listFoodsByRestaurantQuerySchema = paginationQuerySchema;

export const filterFoodByRestaurantQuerySchema = z.object({
  restaurantName: z.string().min(1, 'Restaurant name is required for filter'),
}).merge(paginationQuerySchema);

export const getFoodByIdParamsSchema = z.object({
  id: objectIdSchema,
});

export const updateFoodSchema = z.object({
  foodName: z.string().min(1).optional(),
  foodPrice: z.number().positive().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
  path: ['foodName'],
});

export type UpdateFoodInput = z.infer<typeof updateFoodSchema>;

export type CreateFoodInput = z.infer<typeof createFoodSchema>;
export type FilterFoodQuery = z.infer<typeof filterFoodByRestaurantQuerySchema>;
