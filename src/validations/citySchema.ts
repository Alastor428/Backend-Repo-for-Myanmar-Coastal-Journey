import * as z from 'zod';
import { objectIdSchema, paginationQuerySchema } from './commonSchema';

export const listCitiesQuerySchema = paginationQuerySchema;

export const createCitySchema = z.object({
  cityName: z.string().min(1, 'City name is required'),
});

export const getCityByIdParamsSchema = z.object({
  id: objectIdSchema,
});

export const updateCitySchema = z.object({
  cityName: z.string().min(1, 'City name is required'),
});

export type CreateCityInput = z.infer<typeof createCitySchema>;
