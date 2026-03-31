import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createTravelPackageBookingService,
  getTravelPackageBookingsForUserService,
  getTravelPackageBookingByIdService,
  confirmTravelPaymentService,
} from '../services/travelPackageBookingService';
import { parsePagination } from '../validations/commonSchema';

export const createTravelPackageBooking = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  const booking = await createTravelPackageBookingService(userId, req.body);
  res.status(201).json({
    success: true,
    status: 201,
    message: 'Travel package booking created successfully',
    data: booking,
  });
});

export const getMyTravelPackageBookings = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  const pagination = parsePagination(req.query);
  const result = await getTravelPackageBookingsForUserService(userId, pagination);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Travel package bookings displayed',
    ...result,
  });
});

export const getTravelPackageBookingById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  const booking = await getTravelPackageBookingByIdService(req.params.id, userId);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Travel package booking displayed',
    data: booking,
  });
});

export const confirmTravelPayment = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  const booking = await confirmTravelPaymentService(req.params.id, userId, req.body);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Payment confirmed successfully',
    data: booking,
  });
});

