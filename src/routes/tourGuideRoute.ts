import { Router } from 'express';
import {
  createTourGuide,
  getAllTourGuides,
  getTourGuideById,
  updateTourGuide,
  deleteTourGuide,
} from '../controllers/tourGuideController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import {
  createTourGuideSchema,
  updateTourGuideSchema,
  listTourGuidesQuerySchema,
  getTourGuideByIdParamsSchema,
} from '../validations/tourGuideSchema';

const tourGuideRouter = Router();

tourGuideRouter.post('/', authenticateToken, validate(createTourGuideSchema, 'body'), createTourGuide);
tourGuideRouter.get('/', authenticateToken, validate(listTourGuidesQuerySchema, 'query'), getAllTourGuides);
tourGuideRouter.get(
  '/:id',
  authenticateToken,
  validate(getTourGuideByIdParamsSchema, 'params'),
  getTourGuideById
);
tourGuideRouter.put(
  '/:id',
  authenticateToken,
  validate(getTourGuideByIdParamsSchema, 'params'),
  validate(updateTourGuideSchema, 'body'),
  updateTourGuide
);
tourGuideRouter.delete(
  '/:id',
  authenticateToken,
  validate(getTourGuideByIdParamsSchema, 'params'),
  deleteTourGuide
);

export default tourGuideRouter;

