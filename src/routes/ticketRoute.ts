import { Router } from 'express';
import {
    createTicket,
    getAllTicket,
    getTicketById,
    FilterTicketByBusRoute
} from '../controllers/ticketController';
import { authenticateToken } from '../middlewares/authMiddleware';

const ticketRouter = Router();

ticketRouter.post(
    '/',
    authenticateToken,
    createTicket
)

ticketRouter.get(
    '/',
    authenticateToken,
    getAllTicket
)

ticketRouter.get(
    '/:id',
    authenticateToken,
    getTicketById
)

ticketRouter.get(
    '/filter/op1',
    authenticateToken,
    FilterTicketByBusRoute
)

export default ticketRouter;