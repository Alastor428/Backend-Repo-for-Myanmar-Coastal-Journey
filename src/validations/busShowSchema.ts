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

export const getAllBusShowsQuerySchema = z.object({}).strict();

export const updateSeatStatusParamsSchema = z.object({
  showId: objectIdSchema,
});

export const updateSeatStatusQuerySchema = z.object({
  row: z.string().min(1, 'Row is required'),
  seatNumber: z.string().min(1, 'Seat number is required'),
  status: z.nativeEnum(seatStatus),
});

/** Matches generated layout: row 1–11 + column A–D (e.g. 1A, 11D) */
export const busSeatIdSchema = z
  .string()
  .regex(/^([1-9]|1[01])[A-D]$/, 'Invalid seat id (expected e.g. 1A, 11D)');

export const seatBookingShowIdParamsSchema = z.object({
  showId: objectIdSchema,
});

export const toggleSeatSelectionBodySchema = z.object({
  seatIds: z.array(busSeatIdSchema).min(1, 'At least one seat id is required'),
});

export const confirmSeatsBodySchema = z.object({
  seatIds: z.array(busSeatIdSchema).min(1, 'At least one seat id is required'),
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
export type ToggleSeatSelectionBody = z.infer<typeof toggleSeatSelectionBodySchema>;
export type ConfirmSeatsBody = z.infer<typeof confirmSeatsBodySchema>;
