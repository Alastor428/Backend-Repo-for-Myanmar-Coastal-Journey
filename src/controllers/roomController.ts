import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createRoomService,
  getAllRoomsService,
  getRoomsByRoomTypeService,
  getRoomByIdService,
  updateRoomService,
  deleteRoomService,
} from '../services/roomService';
import { RoomTypes } from '../models/roomModel';
import { parsePagination } from '../validations/commonSchema';

export const createRoom = asyncHandler(async (req: Request, res: Response) => {
  const room = await createRoomService(req.body);
  res.status(201).json({
    success: true,
    status: 201,
    message: 'Room created successfully',
    data: room,
  });
});

export const getAllRooms = asyncHandler(async (req: Request, res: Response) => {
  const pagination = parsePagination(req.query);
  const result = await getAllRoomsService(pagination);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Rooms displayed',
    ...result,
  });
});

export const getRoomsByRoomType = asyncHandler(async (req: Request, res: Response) => {
  const q = req.query as { roomType: RoomTypes };
  const pagination = parsePagination(req.query);
  const result = await getRoomsByRoomTypeService(q.roomType, pagination);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Rooms filtered by type displayed',
    ...result,
  });
});

export const getRoomById = asyncHandler(async (req: Request, res: Response) => {
  const room = await getRoomByIdService(req.params.id);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Room displayed',
    data: room,
  });
});

export const updateRoom = asyncHandler(async (req: Request, res: Response) => {
  const room = await updateRoomService(req.params.id, req.body);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Room updated successfully',
    data: room,
  });
});

export const deleteRoom = asyncHandler(async (req: Request, res: Response) => {
  await deleteRoomService(req.params.id);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Room deleted successfully',
  });
});
