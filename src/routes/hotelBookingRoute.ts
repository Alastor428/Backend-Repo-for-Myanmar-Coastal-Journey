import { Router } from 'express';
import {
  createHotelBooking,
  getMyHotelBookings,
  getHotelBookingById,
  updateHotelBooking,
  deleteHotelBooking,
  confirmHotelBooking,
} from '../controllers/hotelBookingController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import {
  createHotelBookingSchema,
  updateHotelBookingSchema,
  listHotelBookingsQuerySchema,
  getHotelBookingByIdParamsSchema,
} from '../validations/hotelBookingSchema';

const hotelBookingRouter = Router();

hotelBookingRouter.post(
  '/',
  authenticateToken,
  validate(createHotelBookingSchema, 'body'),
  createHotelBooking
);
hotelBookingRouter.get(
  '/',
  authenticateToken,
  validate(listHotelBookingsQuerySchema, 'query'),
  getMyHotelBookings
);
hotelBookingRouter.get(
  '/:id',
  authenticateToken,
  validate(getHotelBookingByIdParamsSchema, 'params'),
  getHotelBookingById
);
hotelBookingRouter.put(
  '/:id',
  authenticateToken,
  validate(getHotelBookingByIdParamsSchema, 'params'),
  validate(updateHotelBookingSchema, 'body'),
  updateHotelBooking
);
hotelBookingRouter.put(
  '/:id/confirm',
  authenticateToken,
  validate(getHotelBookingByIdParamsSchema, 'params'),
  confirmHotelBooking
);
hotelBookingRouter.delete(
  '/:id',
  authenticateToken,
  validate(getHotelBookingByIdParamsSchema, 'params'),
  deleteHotelBooking
);

export default hotelBookingRouter;
