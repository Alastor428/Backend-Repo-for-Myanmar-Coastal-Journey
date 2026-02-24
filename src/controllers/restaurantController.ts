import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Restaurant } from '../models/restaurantModel';

/*
    Create new Restaurant
*/

export const createRestaurant = asyncHandler(
    async (
    req: Request,
    res: Response,
) => {
        const { restaurantName, region, beach, phone }= req.body;

        if(!restaurantName || !region || !beach || !phone) {
             res.status(400).json({
                success: false,
                status: 400,
                message: "restaurantName, region, beach, phone fields are required"
            });
            
        }

        //create restaurant
        const restaurant = new Restaurant({
            restaurantName,
            region,
            beach,
            phone,
        })

        const savedRestaurant = await restaurant.save();
        console.log('This restaurant saved in db', savedRestaurant);

        res.status(201).json({
            success: true,
            status: 201,
            message: 'Restaurant Created Successfully',
            data: restaurant
        })

});

/*
    Get all restaurants
*/
export const getAllRestaurants = asyncHandler(
    async (
    req: Request,
    res: Response,
) => {
        const allRestaurantData = await Restaurant.find()
        .populate('region','regionName')
        .populate('beach','beachName')
        .sort({restaurantName: 1});

        if(!allRestaurantData || allRestaurantData.length === 0) {
            res.status(400)
            throw new Error('Restaurant Data Not Found');
        }

        res.status(200).json({
            success: true,
            status: 200,
            message: 'Restaurant Displayed',
            data: allRestaurantData,
        })
});

/*
    Get a restaurant by id
*/

export const getRestaurantById = asyncHandler(
    async (
    req: Request,
    res: Response
) => {
        const id = req.params.id;
        const ExistedRestaurant = await Restaurant.findById(id);

        if (!ExistedRestaurant) {
            res.status(403)
            throw new Error("Invalid RestaurantId. Wrong Parameter Passed")
        } else {
            res.status(200).json({
                success: true,
                status: 200,
                message: "Restaurant Data Displayed",
                data: ExistedRestaurant,
            })
        }

});