import { Router } from 'express';
import {
    createBus,
    getAllBuses,
    filterAvailableBusByDepartureTime,
    FilterBusBySourceAndDestination,
} from '../controllers/busController';
import { authenticateToken } from '../middlewares/authMiddleware';

const busRouter = Router();

busRouter.post(
    '/',
    authenticateToken,
    createBus
)

busRouter.get(
    '/',
    authenticateToken,
    getAllBuses
)

busRouter.get(
    '/filter/op1',
    authenticateToken,
    filterAvailableBusByDepartureTime
)

busRouter.get(
    '/filter/op2',
    authenticateToken,
    FilterBusBySourceAndDestination
)


export default busRouter;