import { Router } from 'express';
import {
  createRoom,
  getAllRooms,
  getRoomsByRoomType,
  getRoomById,
  updateRoom,
  deleteRoom,
} from '../controllers/roomController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import {
  createRoomSchema,
  updateRoomSchema,
  listRoomsQuerySchema,
  getRoomByIdParamsSchema,
  roomsByRoomTypeQuerySchema,
} from '../validations/roomSchema';

const roomRouter = Router();

roomRouter.post('/', authenticateToken, validate(createRoomSchema, 'body'), createRoom);
roomRouter.get('/', authenticateToken, validate(listRoomsQuerySchema, 'query'), getAllRooms);
roomRouter.get(
  '/filter/room-type',
  authenticateToken,
  validate(roomsByRoomTypeQuerySchema, 'query'),
  getRoomsByRoomType
);
roomRouter.get('/:id', authenticateToken, validate(getRoomByIdParamsSchema, 'params'), getRoomById);
roomRouter.put(
  '/:id',
  authenticateToken,
  validate(getRoomByIdParamsSchema, 'params'),
  validate(updateRoomSchema, 'body'),
  updateRoom
);
roomRouter.delete('/:id', authenticateToken, validate(getRoomByIdParamsSchema, 'params'), deleteRoom);

export default roomRouter;
