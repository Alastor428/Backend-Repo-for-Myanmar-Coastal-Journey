import { Router } from 'express';
import {
  createTicket,
  getAllTicket,
  getTicketById,
  updateTicket,
  deleteTicket,
  FilterTicketByBusRoute,
} from '../controllers/ticketController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import {
  createTicketSchema,
  updateTicketSchema,
  listTicketsQuerySchema,
  getTicketByIdParamsSchema,
  filterTicketByRouteQuerySchema,
} from '../validations/ticketSchema';

const ticketRouter = Router();

ticketRouter.post('/', authenticateToken, validate(createTicketSchema, 'body'), createTicket);
ticketRouter.get('/', authenticateToken, validate(listTicketsQuerySchema, 'query'), getAllTicket);
ticketRouter.get(
  '/filter/op1',
  authenticateToken,
  validate(filterTicketByRouteQuerySchema, 'query'),
  FilterTicketByBusRoute
);
ticketRouter.get('/:id', authenticateToken, validate(getTicketByIdParamsSchema, 'params'), getTicketById);
ticketRouter.put('/:id', authenticateToken, validate(getTicketByIdParamsSchema, 'params'), validate(updateTicketSchema, 'body'), updateTicket);
ticketRouter.delete('/:id', authenticateToken, validate(getTicketByIdParamsSchema, 'params'), deleteTicket);

export default ticketRouter;
