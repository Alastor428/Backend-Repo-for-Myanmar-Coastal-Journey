import * as z from 'zod';
import { objectIdSchema, paginationQuerySchema } from './commonSchema';

export const listTourGuideBookingsQuerySchema = paginationQuerySchema.strict();

export const createTourGuideBookingSchema = z
  .object({
    tourGuide: objectIdSchema,
    guestName: z.string().min(1).optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    currency: z.string().min(1).optional(),
  })
  .strict()
  .refine((data) => data.endDate.getTime() > data.startDate.getTime(), {
    message: 'endDate must be after startDate',
    path: ['endDate'],
  });

export const updateTourGuideBookingSchema = z
  .object({
    guestName: z.string().min(1).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
    path: ['guestName'],
  })
  .refine(
    (data) =>
      (data.startDate && data.endDate && data.endDate.getTime() > data.startDate.getTime()) ||
      !data.startDate ||
      !data.endDate,
    { message: 'endDate must be after startDate', path: ['endDate'] }
  );

export const getTourGuideBookingByIdParamsSchema = z.object({ id: objectIdSchema }).strict();

export type CreateTourGuideBookingInput = z.infer<typeof createTourGuideBookingSchema>;
export type UpdateTourGuideBookingInput = z.infer<typeof updateTourGuideBookingSchema>;

