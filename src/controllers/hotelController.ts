import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createHotelService,
  getAllHotelsService,
  getHotelsByBeachService,
  getHotelByIdService,
  updateHotelService,
  deleteHotelService,
} from '../services/hotelService';
import { parsePagination } from '../validations/commonSchema';

export const createHotel = asyncHandler(async (req: Request, res: Response) => {
  const hotel = await createHotelService(req.body);
  res.status(201).json({
    success: true,
    status: 201,
    message: 'Hotel created successfully',
    data: hotel,
  });
});

export const getAllHotels = asyncHandler(async (req: Request, res: Response) => {
  const pagination = parsePagination(req.query);
  const result = await getAllHotelsService(pagination);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Hotels displayed',
    ...result,
  });
});

export const getHotelsByBeach = asyncHandler(async (req: Request, res: Response) => {
  const q = req.query as { beachId: string };
  const pagination = parsePagination(req.query);
  const result = await getHotelsByBeachService(q.beachId, pagination);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Hotels for beach displayed',
    ...result,
  });
});

export const getHotelById = asyncHandler(async (req: Request, res: Response) => {
  const hotel = await getHotelByIdService(req.params.id);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Hotel displayed',
    data: hotel,
  });
});

export const updateHotel = asyncHandler(async (req: Request, res: Response) => {
  const hotel = await updateHotelService(req.params.id, req.body);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Hotel updated successfully',
    data: hotel,
  });
});

export const deleteHotel = asyncHandler(async (req: Request, res: Response) => {
  await deleteHotelService(req.params.id);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Hotel deleted successfully',
  });
});
