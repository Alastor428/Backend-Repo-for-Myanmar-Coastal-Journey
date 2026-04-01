import * as z from 'zod';
import { TourGuideAvailability, TourGuideGender } from '../models/tourGuideModel';
import { objectIdSchema, paginationQuerySchema } from './commonSchema';

export const listTourGuidesQuerySchema = z
  .object({
    availableOnly: z.coerce.boolean().optional(),
    beachId: objectIdSchema.optional(),
    /** Case-insensitive partial match against `Beach.beachName` */
    beachName: z.string().min(1).optional(),
    gender: z.nativeEnum(TourGuideGender).optional(),
    language: z.string().min(1).optional(),
    /** When used with `endDate`, excludes guides with overlapping Pending/Confirmed bookings */
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
  })
  .merge(paginationQuerySchema)
  .strict()
  .refine(
    (data) =>
      (data.startDate === undefined && data.endDate === undefined) ||
      (data.startDate !== undefined && data.endDate !== undefined),
    {
      message: 'startDate and endDate must both be sent to filter by availability for a date range',
      path: ['startDate'],
    }
  )
  .refine(
    (data) =>
      !data.startDate ||
      !data.endDate ||
      data.endDate.getTime() > data.startDate.getTime(),
    { message: 'endDate must be after startDate', path: ['endDate'] }
  );

export const createTourGuideSchema = z
  .object({
    name: z.string().min(1),
    beach: objectIdSchema.optional(),
    phone: z.string().min(1).optional(),
    experienceYears: z.number().int().min(0).optional(),
    gender: z.nativeEnum(TourGuideGender).optional(),
    languages: z.array(z.string().min(1)).default([]),
    pricePerDay: z.number().nonnegative(),
    currency: z.string().min(1).optional(),
    availability: z.nativeEnum(TourGuideAvailability).optional(),
  })
  .strict();

export const updateTourGuideSchema = z
  .object({
    name: z.string().min(1).optional(),
    beach: objectIdSchema.optional(),
    phone: z.string().min(1).optional(),
    experienceYears: z.number().int().min(0).optional(),
    gender: z.nativeEnum(TourGuideGender).optional(),
    languages: z.array(z.string().min(1)).optional(),
    pricePerDay: z.number().nonnegative().optional(),
    currency: z.string().min(1).optional(),
    availability: z.nativeEnum(TourGuideAvailability).optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
    path: ['name'],
  });

export const getTourGuideByIdParamsSchema = z.object({ id: objectIdSchema }).strict();

export type CreateTourGuideInput = z.infer<typeof createTourGuideSchema>;
export type UpdateTourGuideInput = z.infer<typeof updateTourGuideSchema>;

