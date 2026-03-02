import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Route } from '../models/routeModel';

/*
    create new route
*/

export const createRoute = asyncHandler(
    async (
    req: Request,
    res: Response,
) => {
    const { source, destination, duration, distance } = req.body

    if(!source || !destination || !duration || !distance) {
        res.status(400).json({
            success: false,
            status: 400,
            message: "source, destination, duration, distance fields are required"
        });
    }

    //create restaurant
    const route = new Route({
        source,
        destination,
        duration,
        distance,
    })

    const savedRoute = await route.save();
    console.log('This route saved in db', savedRoute);

    res.status(201).json({
            success: true,
            status: 201,
            message: 'Route Created Successfully',
            data: route
        })
});


/*
    Get all routes
*/
export const getAllRoute = asyncHandler(
    async (
    req: Request,
    res: Response,
) => {
       const allRouteData = await Route.find()
       .populate({
         path: 'source',
         select: 'cityName'
       })
       .populate({
          path: 'destination',
          select: 'beachName'
       })
       .sort({source: 1, destination: 1})
       .select('-createdAt -updatedAt -__v');

       if(!allRouteData || allRouteData.length === 0) {
            res.status(404)
            throw new Error('Route Data Not Found');
       } 
    
        res.status(200).json({
            success: true,
            status: 200,
            message: 'Route Displayed',
            data: allRouteData,
        })
});