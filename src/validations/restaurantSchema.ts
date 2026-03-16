import * as z from 'zod';
import { objectIdSchema, paginationQuerySchema } from './commonSchema';

export const listRestaurantsQuerySchema = paginationQuerySchema;

export const createRestaurantSchema = z.object({
  restaurantName: z.string().min(1, 'Restaurant name is required'),
  region: objectIdSchema,
  beach: objectIdSchema,
  phone: z.string().min(1, 'Phone is required'),
});

export const getRestaurantByIdParamsSchema = z.object({
  id: objectIdSchema,
});

export const updateRestaurantSchema = z.object({
  restaurantName: z.string().min(1).optional(),
  region: objectIdSchema.optional(),
  beach: objectIdSchema.optional(),
  phone: z.string().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
  path: ['restaurantName'],
});

export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;
export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>;
