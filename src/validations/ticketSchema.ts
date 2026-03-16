import * as z from 'zod';
import { objectIdSchema, paginationQuerySchema } from './commonSchema';

export const listTicketsQuerySchema = paginationQuerySchema;

export const createTicketSchema = z.object({
  ticketName: z.string().optional(),
  busId: objectIdSchema,
  source: z.string().min(1, 'Source is required'),
  destination: z.string().min(1, 'Destination is required'),
  departureDate: z.coerce.date(),
  ticketPrice: z.number().positive('Ticket price must be positive'),
  noOfPassenger: z.number().int().min(1).default(1),
  isForeigner: z.boolean().default(false),
});

export const getTicketByIdParamsSchema = z.object({
  id: objectIdSchema,
});

export const filterTicketByRouteQuerySchema = z.object({
  source: z.string().min(1, 'Source is required'),
  destination: z.string().min(1, 'Destination is required'),
}).merge(paginationQuerySchema);

export const updateTicketSchema = z.object({
  ticketName: z.string().optional(),
  busId: objectIdSchema.optional(),
  source: z.string().min(1).optional(),
  destination: z.string().min(1).optional(),
  departureDate: z.coerce.date().optional(),
  ticketPrice: z.number().positive().optional(),
  noOfPassenger: z.number().int().min(1).optional(),
  isForeigner: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
  path: ['ticketName'],
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;
export type FilterTicketQuery = z.infer<typeof filterTicketByRouteQuerySchema>;
