import * as z from 'zod';
import { objectIdSchema, paginationQuerySchema } from './commonSchema';

export const searchTravelPackagesQuerySchema = z
  .object({
    from: z.string().min(1),
    to: z.string().min(1),
    departOnDate: z.coerce.date(),
  })
  .merge(paginationQuerySchema)
  .strict();

export const createTravelPackageSchema = z
  .object({
    packageName: z.string().min(1),
    fromCity: objectIdSchema,
    toBeach: objectIdSchema,
    departOnDate: z.coerce.date(),
    departureTime: z.string().min(1),
    busTicket: z.object({
      ticket: objectIdSchema,
      pricePerPerson: z.number().nonnegative(),
    }),
    hotel: z.object({
      hotel: objectIdSchema,
      nights: z.number().int().min(1),
      feePerNightPerPerson: z.number().nonnegative(),
    }),
    transfers: z.object({
      roundTripFeePerPerson: z.number().nonnegative(),
    }),
    currency: z.string().min(1).optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

export const updateTravelPackageSchema = z
  .object({
    packageName: z.string().min(1).optional(),
    fromCity: objectIdSchema.optional(),
    toBeach: objectIdSchema.optional(),
    departOnDate: z.coerce.date().optional(),
    departureTime: z.string().min(1).optional(),
    busTicket: z
      .object({
        ticket: objectIdSchema.optional(),
        pricePerPerson: z.number().nonnegative().optional(),
      })
      .optional(),
    hotel: z
      .object({
        hotel: objectIdSchema.optional(),
        nights: z.number().int().min(1).optional(),
        feePerNightPerPerson: z.number().nonnegative().optional(),
      })
      .optional(),
    transfers: z
      .object({
        roundTripFeePerPerson: z.number().nonnegative().optional(),
      })
      .optional(),
    currency: z.string().min(1).optional(),
    isActive: z.boolean().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
    path: ['packageName'],
  });

export const getTravelPackageByIdParamsSchema = z.object({ id: objectIdSchema }).strict();

export type CreateTravelPackageInput = z.infer<typeof createTravelPackageSchema>;
export type UpdateTravelPackageInput = z.infer<typeof updateTravelPackageSchema>;
export type SearchTravelPackagesQuery = z.infer<typeof searchTravelPackagesQuerySchema>;

