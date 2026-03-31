import { Router } from 'express';
import {
  createHotel,
  getAllHotels,
  getHotelsByBeach,
  getHotelsByBeachName,
  getHotelById,
  updateHotel,
  deleteHotel,
} from '../controllers/hotelController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import {
  createHotelSchema,
  updateHotelSchema,
  listHotelsQuerySchema,
  getHotelByIdParamsSchema,
  hotelsByBeachQuerySchema,
  hotelsByBeachNameQuerySchema,
} from '../validations/hotelSchema';

const hotelRouter = Router();

hotelRouter.post('/', authenticateToken, validate(createHotelSchema, 'body'), createHotel);
hotelRouter.get('/', authenticateToken, validate(listHotelsQuerySchema, 'query'), getAllHotels);
hotelRouter.get(
  '/filter/beach',
  authenticateToken,
  validate(hotelsByBeachQuerySchema, 'query'),
  getHotelsByBeach
);
hotelRouter.get(
  '/filter/beach-name',
  authenticateToken,
  validate(hotelsByBeachNameQuerySchema, 'query'),
  getHotelsByBeachName
);
hotelRouter.get('/:id', authenticateToken, validate(getHotelByIdParamsSchema, 'params'), getHotelById);
hotelRouter.put(
  '/:id',
  authenticateToken,
  validate(getHotelByIdParamsSchema, 'params'),
  validate(updateHotelSchema, 'body'),
  updateHotel
);
hotelRouter.delete('/:id', authenticateToken, validate(getHotelByIdParamsSchema, 'params'), deleteHotel);

export default hotelRouter;
