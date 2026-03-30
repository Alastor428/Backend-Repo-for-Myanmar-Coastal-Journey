import * as z from 'zod';
import { RoomTypes } from '../models/roomModel';
import { objectIdSchema, paginationQuerySchema } from './commonSchema';

export const listRoomsQuerySchema = paginationQuerySchema;

export const createRoomSchema = z.object({
  hotel: objectIdSchema,
  roomType: z.nativeEnum(RoomTypes),
  roomPricePerNight: z.number().positive(),
  roomCapacity: z.number().int().positive(),
  roomDescription: z.string().min(1),
});

export const getRoomByIdParamsSchema = z.object({
  id: objectIdSchema,
});

export const roomsByRoomTypeQuerySchema = z.object({
  roomType: z.nativeEnum(RoomTypes),
}).merge(paginationQuerySchema);

export const updateRoomSchema = z
  .object({
    hotel: objectIdSchema.optional(),
    roomType: z.nativeEnum(RoomTypes).optional(),
    roomPricePerNight: z.number().positive().optional(),
    roomCapacity: z.number().int().positive().optional(),
    roomDescription: z.string().min(1).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
    path: ['roomType'],
  });

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
