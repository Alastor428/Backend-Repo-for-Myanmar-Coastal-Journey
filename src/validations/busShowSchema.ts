import * as z from 'zod';
import { objectIdSchema } from './commonSchema';
import { seatStatus } from '../models/busBookingShowModel';

export const createBusShowSchema = z.object({
  ticket: objectIdSchema,
  busId: objectIdSchema,
  departureTime: z.string().optional(),
});

export const getBusShowByIdParamsSchema = z.object({
  id: objectIdSchema,
});

export const updateSeatStatusParamsSchema = z.object({
  showId: objectIdSchema,
});

export const updateSeatStatusQuerySchema = z.object({
  row: z.string().min(1, 'Row is required'),
  seatNumber: z.string().min(1, 'Seat number is required'),
  status: z.nativeEnum(seatStatus),
});

export const updateBusShowSchema = z.object({
  departureTime: z.string().min(1).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
  path: ['departureTime'],
});

export type CreateBusShowInput = z.infer<typeof createBusShowSchema>;
export type UpdateBusShowInput = z.infer<typeof updateBusShowSchema>;
export type UpdateSeatStatusQuery = z.infer<typeof updateSeatStatusQuerySchema>;
