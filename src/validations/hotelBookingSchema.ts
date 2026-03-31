import * as z from 'zod';
import { objectIdSchema, paginationQuerySchema } from './commonSchema';

const lineItemInputSchema = z.object({
  room: objectIdSchema,
  checkInDate: z.coerce.date(),
  checkOutDate: z.coerce.date(),
  checkInTimeNote: z.string().min(1).optional(),
  checkOutTimeNote: z.string().min(1).optional(),
  numberOfRooms: z.number().int().min(1),
  numberOfAdults: z.number().int().min(1),
});

export const createHotelBookingSchema = z
  .object({
    hotel: objectIdSchema,
    guestName: z.string().min(1).optional(),
    taxIncluded: z.boolean().optional(),
    currency: z.string().min(1).optional(),
    lineItems: z.array(lineItemInputSchema).min(1, 'At least one room line is required'),
  })
  .refine(
    (data) =>
      data.lineItems.every((item) => item.checkOutDate.getTime() > item.checkInDate.getTime()),
    { message: 'Each checkOutDate must be after checkInDate', path: ['lineItems'] }
  );

export const getHotelBookingByIdParamsSchema = z.object({
  id: objectIdSchema,
});

export const listHotelBookingsQuerySchema = paginationQuerySchema;

export const updateHotelBookingSchema = z
  .object({
    guestName: z.string().min(1).optional(),
    taxIncluded: z.boolean().optional(),
    lineItems: z.array(lineItemInputSchema).min(1).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
    path: ['guestName'],
  })
  .refine(
    (data) =>
      !data.lineItems ||
      data.lineItems.every((item) => item.checkOutDate.getTime() > item.checkInDate.getTime()),
    { message: 'Each checkOutDate must be after checkInDate', path: ['lineItems'] }
  );

export type CreateHotelBookingInput = z.infer<typeof createHotelBookingSchema>;
export type UpdateHotelBookingInput = z.infer<typeof updateHotelBookingSchema>;
export type HotelBookingLineItemInput = z.infer<typeof lineItemInputSchema>;
