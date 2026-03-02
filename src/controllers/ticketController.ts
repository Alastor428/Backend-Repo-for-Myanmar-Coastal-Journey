import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Ticket } from '../models/busTicketModel';

/*
    create new ticket
*/

export const createTicket = asyncHandler(
    async (
    req: Request,
    res: Response,
) => {
    const { ticketName, busId, source, destination, departureDate, ticketPrice, noOfPassenger, isForeigner } = req.body

    if(!ticketName || !busId || !source || !destination || !departureDate || !ticketPrice || !noOfPassenger || !isForeigner){
        res.status(400).json({
            success: false,
            status: 400,
            message: "ticketName, busId, source, destination, arrivalTime, durationTime, ticketPrice, noOfPassenger, TicketType fields are required"
        });
    }

    //create ticket
    const ticket = new Ticket({
        ticketName,
        busId,
        source,
        destination,
        departureDate,
        ticketPrice,
        noOfPassenger,
        isForeigner,
    })

    const savedTicket = await ticket.save();
    console.log('This ticket saved in db', savedTicket);

    res.status(201).json({
            success: true,
            status: 201,
            message: ' Ticket Created Successfully',
            data: ticket
        })
});

/*
    Get all Buses
*/

export const getAllTicket = asyncHandler(
    async (
    req: Request,
    res: Response,
) => {
        const allTicketData = await Ticket.find()
        .select('-createdAt -updatedAt -__v');

        if(!allTicketData || allTicketData.length === 0) {
            res.status(404)
            throw new Error('Ticket Data Not Found')
        }

        res.status(200).json({
            success: true,
            status: 200,
            message: 'All Tickets Displayed',
            data: allTicketData,
        })
});

/*
    Get a ticket by id
*/

export const getTicketById = asyncHandler(
    async (
    req: Request,
    res: Response
) => {
        const id = req.params.id;
        const ExistedTicket = await Ticket.findById(id);

        if(!ExistedTicket) {
            res.status(403)
            throw new Error('Invalid TicketId. Wrong Parameter Passed')
        } else {
            res.status(200).json({
                success: true,
                status: 200,
                message: "Ticket Data Displayed",
                data: ExistedTicket,
            })
        }
});

/*
    Filter options
    Get Ticket by bus route
*/

export const FilterTicketByBusRoute = asyncHandler(
    async (
    req: Request,
    res: Response,
) => {
        const { source, destination } = req.query;

        if(!source || !destination) {
            res.status(400).json({
            success: false,
            status: 400,
            message: "filter params 'source, destination' are required'"
            });
        } 

        const tickets = await Ticket.find({
            source: { $regex: `^${source}$`, $options: "i" },
            destination: { $regex: `^${destination}$`, $options: "i" },
        }).populate('busId');

        res.status(200).json({
            success: true,
            status: 200,
            message: "Tickets filtered successfully",
            data: tickets,
        });

    
});