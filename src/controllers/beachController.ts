import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createRegionService,
  createBeachService,
  getAllBeachesService,
  getBeachByIdService,
  updateRegionService,
  updateBeachService,
  deleteRegionService,
  deleteBeachService,
} from '../services/beachService';
import { parsePagination } from '../validations/commonSchema';

export const createRegion = asyncHandler(async (req: Request, res: Response) => {
  const savedRegion = await createRegionService(req.body);
  res.status(201).json({
    success: true,
    status: 201,
    message: 'Region Created Successfully',
    data: savedRegion,
  });
});

export const createBeach = asyncHandler(async (req: Request, res: Response) => {
  const savedBeach = await createBeachService(req.body);
  res.status(201).json({
    success: true,
    status: 201,
    message: 'Beach Created Successfully',
    data: savedBeach,
  });
});

export const getAllBeach = asyncHandler(async (req: Request, res: Response) => {
  const pagination = parsePagination(req.query);
  const result = await getAllBeachesService(pagination);

  res.status(200).json({
    success: true,
    status: 200,
    message: 'Beach Displayed',
    ...result,
  });
});

export const getBeachById = asyncHandler(async (req: Request, res: Response) => {
  const beach = await getBeachByIdService(req.params.id);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Beach Data Displayed',
    data: beach,
  });
});

export const updateRegion = asyncHandler(async (req: Request, res: Response) => {
  const region = await updateRegionService(req.params.id, req.body);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Region Updated Successfully',
    data: region,
  });
});

export const deleteRegion = asyncHandler(async (req: Request, res: Response) => {
  await deleteRegionService(req.params.id);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Region Deleted Successfully',
  });
});

export const updateBeach = asyncHandler(async (req: Request, res: Response) => {
  const beach = await updateBeachService(req.params.id, req.body);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Beach Updated Successfully',
    data: beach,
  });
});

export const deleteBeach = asyncHandler(async (req: Request, res: Response) => {
  await deleteBeachService(req.params.id);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Beach Deleted Successfully',
  });
});

export const imageUploadController = asyncHandler(async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    res.status(400).json({
      success: false,
      status: 400,
      message: 'No image uploaded',
    });
    return;
  }

  const imageUrls = files.map((file) => `http://localhost:3000/uploads/${file.filename}`);
  res.status(201).json({
    success: true,
    status: 201,
    message: 'Images Created',
    data: imageUrls,
  });
});
