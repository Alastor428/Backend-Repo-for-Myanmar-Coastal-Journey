import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createBusShowService,
  getBusShowByIdService,
  updateSeatService,
  updateBusShowService,
  deleteBusShowService,
} from '../services/busShowService';
import { seatStatus } from '../models/busBookingShowModel';

export const createBusShow = asyncHandler(async (req: Request, res: Response) => {
  const newShow = await createBusShowService(req.body);
  res.status(201).json({
    success: true,
    status: 201,
    message: 'Seat show created successfully',
    data: newShow,
  });
});

export const getBusShowById = asyncHandler(async (req: Request, res: Response) => {
  const show = await getBusShowByIdService(req.params.id);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Bus Seat Show Displayed',
    data: show,
  });
});

export const updateSeatStatus = asyncHandler(async (req: Request, res: Response) => {
  const { showId } = req.params as { showId: string };
  const { row, seatNumber, status } = req.query as { row: string; seatNumber: string; status: string };

  const statusMap: Record<string, seatStatus> = {
    Available: seatStatus.Available,
    Selected: seatStatus.Selected,
    Unavailable: seatStatus.Unavailable,
  };
  const seatStatusValue = statusMap[status] ?? seatStatus.Available;
  const updatedShow = await updateSeatService(showId, row, seatNumber, seatStatusValue);

  res.status(200).json({
    success: true,
    status: 200,
    message: 'Seat show updated successfully',
    data: updatedShow,
  });
});

export const updateBusShow = asyncHandler(async (req: Request, res: Response) => {
  const show = await updateBusShowService(req.params.id, req.body);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Bus Show Updated Successfully',
    data: show,
  });
});

export const deleteBusShow = asyncHandler(async (req: Request, res: Response) => {
  await deleteBusShowService(req.params.id);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Bus Show Deleted Successfully',
  });
});
