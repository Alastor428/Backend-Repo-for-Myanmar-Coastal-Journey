import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createRouteService,
  getAllRoutesService,
  getRouteByIdService,
  updateRouteService,
  deleteRouteService,
} from '../services/routeService';
import { parsePagination } from '../validations/commonSchema';

export const createRoute = asyncHandler(async (req: Request, res: Response) => {
  const savedRoute = await createRouteService(req.body);
  res.status(201).json({
    success: true,
    status: 201,
    message: 'Route Created Successfully',
    data: savedRoute,
  });
});

export const getAllRoute = asyncHandler(async (req: Request, res: Response) => {
  const pagination = parsePagination(req.query);
  const result = await getAllRoutesService(pagination);

  res.status(200).json({
    success: true,
    status: 200,
    message: 'Route Displayed',
    ...result,
  });
});

export const getRouteById = asyncHandler(async (req: Request, res: Response) => {
  const route = await getRouteByIdService(req.params.id);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Route Displayed',
    data: route,
  });
});

export const updateRoute = asyncHandler(async (req: Request, res: Response) => {
  const route = await updateRouteService(req.params.id, req.body);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Route Updated Successfully',
    data: route,
  });
});

export const deleteRoute = asyncHandler(async (req: Request, res: Response) => {
  await deleteRouteService(req.params.id);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Route Deleted Successfully',
  });
});
