import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createTicketService,
  getAllTicketsService,
  getTicketByIdService,
  updateTicketService,
  deleteTicketService,
  filterTicketsByRouteService,
} from '../services/ticketService';
import { filterTicketByRouteQuerySchema } from '../validations/ticketSchema';
import { parsePagination } from '../validations/commonSchema';

export const createTicket = asyncHandler(async (req: Request, res: Response) => {
  const savedTicket = await createTicketService(req.body);
  res.status(201).json({
    success: true,
    status: 201,
    message: 'Ticket Created Successfully',
    data: savedTicket,
  });
});

export const getAllTicket = asyncHandler(async (req: Request, res: Response) => {
  const pagination = parsePagination(req.query);
  const result = await getAllTicketsService(pagination);

  res.status(200).json({
    success: true,
    status: 200,
    message: 'All Tickets Displayed',
    ...result,
  });
});

export const getTicketById = asyncHandler(async (req: Request, res: Response) => {
  const ticket = await getTicketByIdService(req.params.id);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Ticket Data Displayed',
    data: ticket,
  });
});

export const updateTicket = asyncHandler(async (req: Request, res: Response) => {
  const ticket = await updateTicketService(req.params.id, req.body);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Ticket Updated Successfully',
    data: ticket,
  });
});

export const deleteTicket = asyncHandler(async (req: Request, res: Response) => {
  await deleteTicketService(req.params.id);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'Ticket Deleted Successfully',
  });
});

export const FilterTicketByBusRoute = asyncHandler(async (req: Request, res: Response) => {
  const parsed = filterTicketByRouteQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(422).json({
      success: false,
      status: 422,
      message: 'Validation failed',
      errors: parsed.error.flatten(),
    });
    return;
  }

  const { source, destination, page, limit, sortBy, sortOrder } = parsed.data;
  const result = await filterTicketsByRouteService(
    { source, destination },
    { page, limit, sortBy, sortOrder: sortOrder ?? 'asc' }
  );

  res.status(200).json({
    success: true,
    status: 200,
    message: 'Tickets filtered successfully',
    ...result,
  });
});
