import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createHotelBookingService,
  getHotelBookingsForUserService,
  getHotelBookingByIdService,
  updateHotelBookingService,
  deleteHotelBookingService,
  confirmHotelBookingService,
} from '../services/hotelBookingService';
import { parsePagination } from '../validations/commonSchema';

export const createHotelBooking = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  const booking = await createHotelBookingService(userId, req.body);
  res.status(201).json({
    success: true,
    status: 201,
    message: 'Hotel booking created successfully',
    data: booking,
  });
});

export const getMyHotelBookings = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  const pagination = parsePagination(req.query);
  const result = await getHotelBookingsForUserService(userId, pagination);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Hotel bookings displayed',
    ...result,
  });
});

export const getHotelBookingById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  const booking = await getHotelBookingByIdService(req.params.id, userId);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Hotel booking displayed',
    data: booking,
  });
});

export const updateHotelBooking = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  const booking = await updateHotelBookingService(req.params.id, userId, req.body);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Hotel booking updated successfully',
    data: booking,
  });
});

export const deleteHotelBooking = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  await deleteHotelBookingService(req.params.id, userId);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Hotel booking deleted successfully',
  });
});

export const confirmHotelBooking = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }

  const booking = await confirmHotelBookingService(req.params.id, userId);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Hotel booking confirmed successfully',
    data: booking,
  });
});
