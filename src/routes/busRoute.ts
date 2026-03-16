import { Router } from 'express';
import {
  createBus,
  getAllBuses,
  getBusById,
  updateBus,
  deleteBus,
  filterAvailableBusByDepartureTime,
  FilterBusBySourceAndDestination,
} from '../controllers/busController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import {
  createBusSchema,
  updateBusSchema,
  listBusesQuerySchema,
  getBusByIdParamsSchema,
  filterBusByDepartureQuerySchema,
  filterBusBySourceDestinationQuerySchema,
} from '../validations/busSchema';

const busRouter = Router();

busRouter.post('/', authenticateToken, validate(createBusSchema, 'body'), createBus);
busRouter.get('/', authenticateToken, validate(listBusesQuerySchema, 'query'), getAllBuses);
busRouter.get(
  '/filter/op1',
  authenticateToken,
  validate(filterBusByDepartureQuerySchema, 'query'),
  filterAvailableBusByDepartureTime
);
busRouter.get(
  '/filter/op2',
  authenticateToken,
  validate(filterBusBySourceDestinationQuerySchema, 'query'),
  FilterBusBySourceAndDestination
);
busRouter.get('/:id', authenticateToken, validate(getBusByIdParamsSchema, 'params'), getBusById);
busRouter.put('/:id', authenticateToken, validate(getBusByIdParamsSchema, 'params'), validate(updateBusSchema, 'body'), updateBus);
busRouter.delete('/:id', authenticateToken, validate(getBusByIdParamsSchema, 'params'), deleteBus);

export default busRouter;
