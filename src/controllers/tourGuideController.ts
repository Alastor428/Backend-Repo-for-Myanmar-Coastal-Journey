import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createTourGuideService,
  getAllTourGuidesService,
  getTourGuideByIdService,
  updateTourGuideService,
  deleteTourGuideService,
} from '../services/tourGuideService';
import { parsePagination } from '../validations/commonSchema';

export const createTourGuide = asyncHandler(async (req: Request, res: Response) => {
  const guide = await createTourGuideService(req.body);
  res.status(201).json({
    success: true,
    status: 201,
    message: 'Tour guide created successfully',
    data: guide,
  });
});

export const getAllTourGuides = asyncHandler(async (req: Request, res: Response) => {
  const pagination = parsePagination(req.query);
  const q = req.query as unknown as {
    availableOnly?: boolean;
    beachId?: string;
    beachName?: string;
    gender?: string;
    language?: string;
    startDate?: Date;
    endDate?: Date;
  };
  const result = await getAllTourGuidesService(pagination, q);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Tour guides displayed',
    ...result,
  });
});

export const getTourGuideById = asyncHandler(async (req: Request, res: Response) => {
  const guide = await getTourGuideByIdService(req.params.id);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Tour guide displayed',
    data: guide,
  });
});

export const updateTourGuide = asyncHandler(async (req: Request, res: Response) => {
  const guide = await updateTourGuideService(req.params.id, req.body);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Tour guide updated successfully',
    data: guide,
  });
});

export const deleteTourGuide = asyncHandler(async (req: Request, res: Response) => {
  await deleteTourGuideService(req.params.id);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Tour guide deleted successfully',
  });
});

