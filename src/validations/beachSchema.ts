import * as z from 'zod';
import { objectIdSchema, paginationQuerySchema } from './commonSchema';

export const listBeachesQuerySchema = paginationQuerySchema;

export const createRegionSchema = z.object({
  regionName: z.string().min(1, 'Region name is required'),
});

export const createBeachSchema = z.object({
  beachName: z.string().min(1, 'Beach name is required'),
  region: objectIdSchema,
  currentSafe: z.boolean(),
  imageUrl: z.array(z.string().url()).min(1, 'At least one image URL is required'),
});

export const getBeachByIdParamsSchema = z.object({
  id: objectIdSchema,
});

export const getRegionByIdParamsSchema = z.object({
  id: objectIdSchema,
});

export const updateRegionSchema = z.object({
  regionName: z.string().min(1, 'Region name is required'),
});

export const updateBeachSchema = z.object({
  beachName: z.string().min(1).optional(),
  region: objectIdSchema.optional(),
  currentSafe: z.boolean().optional(),
  imageUrl: z.array(z.string().url()).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
  path: ['beachName'],
});

export type CreateRegionInput = z.infer<typeof createRegionSchema>;
export type CreateBeachInput = z.infer<typeof createBeachSchema>;
export type UpdateRegionInput = z.infer<typeof updateRegionSchema>;
export type UpdateBeachInput = z.infer<typeof updateBeachSchema>;
