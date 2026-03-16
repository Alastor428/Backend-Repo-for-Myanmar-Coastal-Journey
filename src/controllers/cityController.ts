import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createCityService,
  getAllCitiesService,
  getCityByIdService,
  updateCityService,
  deleteCityService,
} from '../services/cityService';
import { parsePagination } from '../validations/commonSchema';

export const createCity = asyncHandler(async (req: Request, res: Response) => {
  const savedCity = await createCityService(req.body);
  res.status(201).json({
    success: true,
    status: 201,
    message: 'City Created Successfully',
    data: savedCity,
  });
});

export const getAllCity = asyncHandler(async (req: Request, res: Response) => {
  const pagination = parsePagination(req.query);
  const result = await getAllCitiesService(pagination);

  res.status(200).json({
    success: true,
    status: 200,
    message: 'City Displayed',
    ...result,
  });
});

export const getCityById = asyncHandler(async (req: Request, res: Response) => {
  const city = await getCityByIdService(req.params.id);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'City Data Displayed',
    data: city,
  });
});

export const updateCity = asyncHandler(async (req: Request, res: Response) => {
  const city = await updateCityService(req.params.id, req.body);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'City Updated Successfully',
    data: city,
  });
});

export const deleteCity = asyncHandler(async (req: Request, res: Response) => {
  await deleteCityService(req.params.id);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'City Deleted Successfully',
  });
});
