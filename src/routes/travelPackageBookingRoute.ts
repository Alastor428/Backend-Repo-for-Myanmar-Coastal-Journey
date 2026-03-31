import { Router } from 'express';
import {
  createTravelPackageBooking,
  getMyTravelPackageBookings,
  getTravelPackageBookingById,
  confirmTravelPayment,
} from '../controllers/travelPackageBookingController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import {
  createTravelPackageBookingSchema,
  listTravelPackageBookingsQuerySchema,
  getTravelPackageBookingByIdParamsSchema,
  confirmTravelPaymentSchema,
} from '../validations/travelPackageBookingSchema';

const travelPackageBookingRouter = Router();

travelPackageBookingRouter.post(
  '/',
  authenticateToken,
  validate(createTravelPackageBookingSchema, 'body'),
  createTravelPackageBooking
);
travelPackageBookingRouter.get(
  '/',
  authenticateToken,
  validate(listTravelPackageBookingsQuerySchema, 'query'),
  getMyTravelPackageBookings
);
travelPackageBookingRouter.get(
  '/:id',
  authenticateToken,
  validate(getTravelPackageBookingByIdParamsSchema, 'params'),
  getTravelPackageBookingById
);
travelPackageBookingRouter.post(
  '/:id/confirm-payment',
  authenticateToken,
  validate(getTravelPackageBookingByIdParamsSchema, 'params'),
  validate(confirmTravelPaymentSchema, 'body'),
  confirmTravelPayment
);

export default travelPackageBookingRouter;

