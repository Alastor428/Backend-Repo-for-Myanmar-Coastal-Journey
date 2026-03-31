import * as z from 'zod';
import { objectIdSchema, paginationQuerySchema } from './commonSchema';
import { TravelPaymentMethod } from '../models/travelPackageBookingModel';

export const listTravelPackageBookingsQuerySchema = paginationQuerySchema.strict();

export const createTravelPackageBookingSchema = z
  .object({
    travelPackage: objectIdSchema,
    numberOfPeople: z.number().int().min(1).default(1),
  })
  .strict();

const cardNumberSchema = z
  .string()
  .regex(/^\d{16}$/, 'Card number must be exactly 16 digits');

const cardPasswordSchema = z
  .string()
  .regex(/^\d{4,6}$/, 'Card password must be 4 to 6 digits');

export const confirmTravelPaymentSchema = z
  .object({
    paymentMethod: z.nativeEnum(TravelPaymentMethod),
    cardNumber: cardNumberSchema,
    cardPassword: cardPasswordSchema,
    recipientLast4: z.string().regex(/^\d{4}$/, 'recipientLast4 must be 4 digits').optional(),
  })
  .strict();

export const getTravelPackageBookingByIdParamsSchema = z.object({ id: objectIdSchema }).strict();

export type CreateTravelPackageBookingInput = z.infer<typeof createTravelPackageBookingSchema>;
export type ConfirmTravelPaymentInput = z.infer<typeof confirmTravelPaymentSchema>;

