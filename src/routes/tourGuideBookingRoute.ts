import { Router } from 'express';
import {
  createTourGuideBooking,
  getMyTourGuideBookings,
  getTourGuideBookingById,
  updateTourGuideBooking,
  deleteTourGuideBooking,
  confirmTourGuideBooking,
} from '../controllers/tourGuideBookingController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import {
  createTourGuideBookingSchema,
  updateTourGuideBookingSchema,
  listTourGuideBookingsQuerySchema,
  getTourGuideBookingByIdParamsSchema,
} from '../validations/tourGuideBookingSchema';

const tourGuideBookingRouter = Router();

tourGuideBookingRouter.post(
  '/',
  authenticateToken,
  validate(createTourGuideBookingSchema, 'body'),
  createTourGuideBooking
);
tourGuideBookingRouter.get(
  '/',
  authenticateToken,
  validate(listTourGuideBookingsQuerySchema, 'query'),
  getMyTourGuideBookings
);
tourGuideBookingRouter.get(
  '/:id',
  authenticateToken,
  validate(getTourGuideBookingByIdParamsSchema, 'params'),
  getTourGuideBookingById
);
tourGuideBookingRouter.put(
  '/:id',
  authenticateToken,
  validate(getTourGuideBookingByIdParamsSchema, 'params'),
  validate(updateTourGuideBookingSchema, 'body'),
  updateTourGuideBooking
);
tourGuideBookingRouter.put(
  '/:id/confirm',
  authenticateToken,
  validate(getTourGuideBookingByIdParamsSchema, 'params'),
  confirmTourGuideBooking
);
tourGuideBookingRouter.delete(
  '/:id',
  authenticateToken,
  validate(getTourGuideBookingByIdParamsSchema, 'params'),
  deleteTourGuideBooking
);

export default tourGuideBookingRouter;

