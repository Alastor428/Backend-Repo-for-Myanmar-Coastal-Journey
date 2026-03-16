import { Ticket } from '../models/busTicketModel';
import type { CreateTicketInput, UpdateTicketInput, FilterTicketQuery } from '../validations/ticketSchema';
import type { PaginationQuery } from '../validations/commonSchema';

export const createTicketService = async (data: CreateTicketInput) => {
  const ticket = new Ticket({
    ticketName: data.ticketName,
    busId: data.busId,
    source: data.source,
    destination: data.destination,
    departureDate: data.departureDate,
    ticketPrice: data.ticketPrice,
    noOfPassenger: data.noOfPassenger,
    isForeigner: data.isForeigner,
  });
  return ticket.save();
};

export const getAllTicketsService = async (pagination: PaginationQuery) => {
  const { page, limit, sortBy = 'departureDate', sortOrder } = pagination;
  const skip = (page - 1) * limit;
  const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const [data, total] = await Promise.all([
    Ticket.find()
      .populate('busId')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-createdAt -updatedAt -__v')
      .lean(),
    Ticket.countDocuments(),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getTicketByIdService = async (id: string) => {
  const ticket = await Ticket.findById(id).populate('busId');
  if (!ticket) throw new Error('Invalid TicketId. Wrong Parameter Passed');
  return ticket;
};

export const filterTicketsByRouteService = async (query: FilterTicketQuery, pagination: PaginationQuery) => {
  const { page, limit, sortBy = 'departureDate', sortOrder } = pagination;
  const skip = (page - 1) * limit;
  const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const filter = {
    source: { $regex: `^${query.source}$`, $options: 'i' },
    destination: { $regex: `^${query.destination}$`, $options: 'i' },
  };

  const [data, total] = await Promise.all([
    Ticket.find(filter)
      .populate('busId')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Ticket.countDocuments(filter),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const updateTicketService = async (id: string, data: UpdateTicketInput) => {
  const ticket = await Ticket.findByIdAndUpdate(id, { $set: data }, { new: true })
    .populate('busId');
  if (!ticket) throw new Error('Invalid TicketId. Wrong Parameter Passed');
  return ticket;
};

export const deleteTicketService = async (id: string) => {
  const ticket = await Ticket.findByIdAndDelete(id);
  if (!ticket) throw new Error('Invalid TicketId. Wrong Parameter Passed');
  return ticket;
};
