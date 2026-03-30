import * as z from 'zod';
import { objectIdSchema, paginationQuerySchema } from './commonSchema';

export const listHotelsQuerySchema = paginationQuerySchema;

export const createHotelSchema = z.object({
  hotelName: z.string().min(1, 'Hotel name is required'),
  beach: objectIdSchema,
  hotelRating: z.number().min(0).max(5),
});

export const getHotelByIdParamsSchema = z.object({
  id: objectIdSchema,
});

export const hotelsByBeachQuerySchema = z.object({
  beachId: objectIdSchema,
});

export const updateHotelSchema = z
  .object({
    hotelName: z.string().min(1).optional(),
    beach: objectIdSchema.optional(),
    hotelRating: z.number().min(0).max(5).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
    path: ['hotelName'],
  });

export type CreateHotelInput = z.infer<typeof createHotelSchema>;
export type UpdateHotelInput = z.infer<typeof updateHotelSchema>;
