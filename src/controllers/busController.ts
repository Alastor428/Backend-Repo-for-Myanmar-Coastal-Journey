import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createBusService,
  getAllBusesService,
  getBusByIdService,
  updateBusService,
  deleteBusService,
  filterBusesByDepartureService,
  filterBusesBySourceDestinationService,
} from '../services/busService';
import {
  filterBusByDepartureQuerySchema,
  filterBusBySourceDestinationQuerySchema,
} from '../validations/busSchema';
import { parsePagination } from '../validations/commonSchema';

export const createBus = asyncHandler(async (req: Request, res: Response) => {
  const savedBus = await createBusService(req.body);
  res.status(201).json({
    success: true,
    status: 201,
    message: 'Bus Created Successfully',
    data: savedBus,
  });
});

export const getBusById = asyncHandler(async (req: Request, res: Response) => {
  const bus = await getBusByIdService(req.params.id);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Bus Data Displayed',
    data: bus,
  });
});

export const updateBus = asyncHandler(async (req: Request, res: Response) => {
  const bus = await updateBusService(req.params.id, req.body);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Bus Updated Successfully',
    data: bus,
  });
});

export const deleteBus = asyncHandler(async (req: Request, res: Response) => {
  await deleteBusService(req.params.id);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Bus Deleted Successfully',
  });
});

export const getAllBuses = asyncHandler(async (req: Request, res: Response) => {
  const pagination = parsePagination(req.query);
  const result = await getAllBusesService(pagination);

  res.status(200).json({
    success: true,
    status: 200,
    message: 'All buses Displayed',
    ...result,
  });
});

export const filterAvailableBusByDepartureTime = asyncHandler(async (req: Request, res: Response) => {
  const parsed = filterBusByDepartureQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(422).json({
      success: false,
      status: 422,
      message: 'Validation failed',
      errors: parsed.error.flatten(),
    });
    return;
  }

  const { departureTime, isAvailable, page, limit, sortBy, sortOrder } = parsed.data;
  const result = await filterBusesByDepartureService(
    { departureTime, isAvailable },
    { page, limit, sortBy, sortOrder: sortOrder ?? 'asc' }
  );

  res.status(200).json({
    success: true,
    status: 200,
    message: 'Filtered Buses successfully',
    ...result,
  });
});

export const FilterBusBySourceAndDestination = asyncHandler(async (req: Request, res: Response) => {
  const parsed = filterBusBySourceDestinationQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(422).json({
      success: false,
      status: 422,
      message: 'Validation failed',
      errors: parsed.error.flatten(),
    });
    return;
  }

  const { source, destination, page, limit, sortBy, sortOrder } = parsed.data;
  const result = await filterBusesBySourceDestinationService(
    { source, destination },
    { page, limit, sortBy, sortOrder: sortOrder ?? 'asc' }
  );

  res.status(200).json({
    success: true,
    status: 200,
    message: 'Filtered Buses successfully',
    ...result,
  });
});
