import * as z from 'zod';
import { objectIdSchema, paginationQuerySchema } from './commonSchema';

export const listRoutesQuerySchema = paginationQuerySchema;

export const createRouteSchema = z.object({
  source: objectIdSchema,
  destination: objectIdSchema,
  duration: z.number().int().positive('Duration must be positive (minutes)'),
  distance: z.number().positive('Distance must be positive'),
});

export const getRouteByIdParamsSchema = z.object({
  id: objectIdSchema,
});

export const updateRouteSchema = z.object({
  source: objectIdSchema.optional(),
  destination: objectIdSchema.optional(),
  duration: z.number().int().positive().optional(),
  distance: z.number().positive().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
  path: ['source'],
});

export type CreateRouteInput = z.infer<typeof createRouteSchema>;
export type UpdateRouteInput = z.infer<typeof updateRouteSchema>;
