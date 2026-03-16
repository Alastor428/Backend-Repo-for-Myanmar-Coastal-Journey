import * as z from 'zod';
import { objectIdSchema, paginationQuerySchema } from './commonSchema';

export const createBusSchema = z.object({
  route: objectIdSchema,
  noOfSeats: z.number().int().positive('Number of seats must be positive'),
  departureTime: z.string().min(1, 'Departure time is required'),
  isAvailable: z.boolean(),
});

export const listBusesQuerySchema = paginationQuerySchema;

export const filterBusByDepartureQuerySchema = z.object({
  departureTime: z.string().min(1, 'Departure time is required'),
  isAvailable: z.enum(['true', 'false']).transform((v) => v === 'true'),
}).merge(paginationQuerySchema);

export const filterBusBySourceDestinationQuerySchema = z.object({
  source: z.string().min(1, 'Source (city name) is required'),
  destination: z.string().min(1, 'Destination (beach name) is required'),
}).merge(paginationQuerySchema);

export const getBusByIdParamsSchema = z.object({
  id: objectIdSchema,
});

export const updateBusSchema = z.object({
  route: objectIdSchema.optional(),
  noOfSeats: z.number().int().positive().optional(),
  departureTime: z.string().min(1).optional(),
  isAvailable: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
  path: ['route'],
});

export type CreateBusInput = z.infer<typeof createBusSchema>;
export type UpdateBusInput = z.infer<typeof updateBusSchema>;
export type FilterBusByDepartureQuery = z.infer<typeof filterBusByDepartureQuerySchema>;
export type FilterBusBySourceDestinationQuery = z.infer<typeof filterBusBySourceDestinationQuerySchema>;
