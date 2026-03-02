import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Bus } from '../models/busModel';
import { City } from '../models/cityModel';
import { Beach } from '../models/beachModel';
import { Route } from '../models/routeModel';

/*
    create new bus
*/

export const createBus = asyncHandler(
    async (
    req: Request,
    res: Response,
) => {
    const { route, noOfSeats, departureTime, isAvailable } = req.body

    if(!route || !noOfSeats || !departureTime || !isAvailable) {
        res.status(400).json({
            success: false,
            status: 400,
            message: "route, noOfSeats, departureTime, price, isAvailable fields are required"
        });
    }

    //create bus
    const bus = new Bus({
        route,
        noOfSeats,
        departureTime,
        isAvailable,
    })

    const savedBus = await bus.save();
    console.log('This bus saved in db', savedBus);

    res.status(201).json({
            success: true,
            status: 201,
            message: ' Bus Created Successfully',
            data: bus
        })
});

/*
    Get all Buses
*/
export const getAllBuses = asyncHandler(
    async (
    req: Request,
    res: Response,
) => {
    const allBusData = await Bus.find()
  .populate({
    path: 'route',
    select: 'source destination',
    populate: [
      {
        path: 'source',
        select: 'cityName -_id'
      },
      {
        path: 'destination',
        select: 'beachName -_id'
      },
      {
        path: 'duration',
        select: 'duration -_id'
      }
    ]
  })
  .select('noOfSeats departureTime isAvailable route -_id');
    if(!allBusData || allBusData.length === 0) {
        res.status(404)
        throw new Error('Bus Data Not Found')
    }

    res.status(200).json({
            success: true,
            status: 200,
            message: 'All buses Displayed',
            data: allBusData,
        })
});

/*
    Filter options
    Get available bus by depature time
*/
export const filterAvailableBusByDepartureTime = asyncHandler(
    async (
    req: Request,
    res: Response,
) => {
        const { departureTime, isAvailable } = req.query;
        console.log('query : ', req.query);

        if(!departureTime || isAvailable == undefined) {
            res.status(400).json({
            success: false,
            status: 400,
            message: "filter options 'departureTime, isAvailable' are required'"
            });
            return;
        }

        const filteredBuses = await Bus.find({
            departureTime: departureTime,
            isAvailable: isAvailable === 'true'
        });

        if(!filteredBuses  || filteredBuses.length === 0) {
            res.status(404).json({
                success: false,
                status: 400,
                message: 'No buses found',
            });
        }

        res.status(200).json({
            success: true,
            status: 200,
            message: 'Filtered Buses successfully',
            data: filteredBuses,
        })
});

/*
    Filter Options
    Get bus from source to destination
*/

export const FilterBusBySourceAndDestination = asyncHandler(
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

        const city = await City.findOne({ cityName: source });
        const beach = await Beach.findOne({ beachName: destination })

        if(!city || !beach) {
            res.status(404).json({
                success: false,
                status: 400,
                message: 'Source or Destination Not Found',
            })
        }

        const route = await Route.findOne(
            { 
              source: city?._id,
              destination: beach?._id 
            } as any);

        
        if (!route) {
            res.status(404).json({ message: "No route found between source and destination" });
        }

        const buses = await Bus.find({ 
            route: route?._id 
        } as any).populate({
            path: 'route',
            select: 'source destination',
            populate: [
            {
                path: 'source',
                select: 'cityName -_id'
            },
            {
                path: 'destination',
                select: 'beachName -_id'
            },
            {
                path: 'duration',
                select: 'duration -_id'
            }
            ]
        }).select('-createdAt -updatedAt -__v');
        
         res.status(200).json({
            success: true,
            status: 200,
            message: 'Filtered Buses successfully',
            data: buses,
        })
});