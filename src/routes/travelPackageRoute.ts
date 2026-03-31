import { Router } from 'express';
import {
  createTravelPackage,
  searchTravelPackages,
  getTravelPackageById,
  updateTravelPackage,
  deleteTravelPackage,
} from '../controllers/travelPackageController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import {
  createTravelPackageSchema,
  updateTravelPackageSchema,
  searchTravelPackagesQuerySchema,
  getTravelPackageByIdParamsSchema,
} from '../validations/travelPackageSchema';

const travelPackageRouter = Router();

// Search packages by from/to/date
travelPackageRouter.get(
  '/',
  authenticateToken,
  validate(searchTravelPackagesQuerySchema, 'query'),
  searchTravelPackages
);

// Admin-like CRUD
travelPackageRouter.post('/', authenticateToken, validate(createTravelPackageSchema, 'body'), createTravelPackage);
travelPackageRouter.get(
  '/:id',
  authenticateToken,
  validate(getTravelPackageByIdParamsSchema, 'params'),
  getTravelPackageById
);
travelPackageRouter.put(
  '/:id',
  authenticateToken,
  validate(getTravelPackageByIdParamsSchema, 'params'),
  validate(updateTravelPackageSchema, 'body'),
  updateTravelPackage
);
travelPackageRouter.delete(
  '/:id',
  authenticateToken,
  validate(getTravelPackageByIdParamsSchema, 'params'),
  deleteTravelPackage
);

export default travelPackageRouter;

