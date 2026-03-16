import { Router } from 'express';
import {
  createBusShow,
  getBusShowById,
  updateSeatStatus,
  updateBusShow,
  deleteBusShow,
} from '../controllers/busShowController';
import { authenticateToken, requireAgeForBooking } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import {
  createBusShowSchema,
  updateBusShowSchema,
  getBusShowByIdParamsSchema,
  updateSeatStatusParamsSchema,
  updateSeatStatusQuerySchema,
} from '../validations/busShowSchema';

const busSeatShowRouter = Router();

busSeatShowRouter.post('/', authenticateToken, validate(createBusShowSchema, 'body'), createBusShow);
busSeatShowRouter.get('/:id', authenticateToken, validate(getBusShowByIdParamsSchema, 'params'), getBusShowById);
busSeatShowRouter.put(
  '/:id',
  authenticateToken,
  validate(getBusShowByIdParamsSchema, 'params'),
  validate(updateBusShowSchema, 'body'),
  updateBusShow
);
busSeatShowRouter.delete('/:id', authenticateToken, validate(getBusShowByIdParamsSchema, 'params'), deleteBusShow);
busSeatShowRouter.put(
  '/:showId/seat',
  authenticateToken,
  requireAgeForBooking,
  validate(updateSeatStatusParamsSchema, 'params'),
  validate(updateSeatStatusQuerySchema, 'query'),
  updateSeatStatus
);

export default busSeatShowRouter;
