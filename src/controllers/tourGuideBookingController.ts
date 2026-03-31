import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createTourGuideBookingService,
  getTourGuideBookingsForUserService,
  getTourGuideBookingByIdService,
  updateTourGuideBookingService,
  deleteTourGuideBookingService,
  confirmTourGuideBookingService,
} from '../services/tourGuideBookingService';
import { parsePagination } from '../validations/commonSchema';

export const createTourGuideBooking = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  const booking = await createTourGuideBookingService(userId, req.body);
  res.status(201).json({
    success: true,
    status: 201,
    message: 'Tour guide booking created successfully',
    data: booking,
  });
});

export const getMyTourGuideBookings = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  const pagination = parsePagination(req.query);
  const result = await getTourGuideBookingsForUserService(userId, pagination);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Tour guide bookings displayed',
    ...result,
  });
});

export const getTourGuideBookingById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  const booking = await getTourGuideBookingByIdService(req.params.id, userId);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Tour guide booking displayed',
    data: booking,
  });
});

export const updateTourGuideBooking = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  const booking = await updateTourGuideBookingService(req.params.id, userId, req.body);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Tour guide booking updated successfully',
    data: booking,
  });
});

export const deleteTourGuideBooking = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  await deleteTourGuideBookingService(req.params.id, userId);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Tour guide booking deleted successfully',
  });
});

export const confirmTourGuideBooking = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  const booking = await confirmTourGuideBookingService(req.params.id, userId);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Tour guide booking confirmed successfully',
    data: booking,
  });
});

