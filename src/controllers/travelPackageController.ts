import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createTravelPackageService,
  searchTravelPackagesService,
  getTravelPackageByIdService,
  updateTravelPackageService,
  deleteTravelPackageService,
} from '../services/travelPackageService';
import { parsePagination } from '../validations/commonSchema';

export const createTravelPackage = asyncHandler(async (req: Request, res: Response) => {
  const pkg = await createTravelPackageService(req.body);
  res.status(201).json({
    success: true,
    status: 201,
    message: 'Travel package created successfully',
    data: pkg,
  });
});

export const searchTravelPackages = asyncHandler(async (req: Request, res: Response) => {
  const pagination = parsePagination(req.query);
  const q = req.query as unknown as { from: string; to: string; departOnDate: Date };
  const result = await searchTravelPackagesService(q as any, pagination);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Travel packages displayed',
    ...result,
  });
});

export const getTravelPackageById = asyncHandler(async (req: Request, res: Response) => {
  const pkg = await getTravelPackageByIdService(req.params.id);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Travel package displayed',
    data: pkg,
  });
});

export const updateTravelPackage = asyncHandler(async (req: Request, res: Response) => {
  const pkg = await updateTravelPackageService(req.params.id, req.body);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Travel package updated successfully',
    data: pkg,
  });
});

export const deleteTravelPackage = asyncHandler(async (req: Request, res: Response) => {
  await deleteTravelPackageService(req.params.id);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Travel package deleted successfully',
  });
});

