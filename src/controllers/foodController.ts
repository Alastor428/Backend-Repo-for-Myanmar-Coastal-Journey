import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import { Food } from '../models/foodModel';
import { Restaurant } from '../models/restaurantModel';

/*
    Create new Food
*/

export const createFood = asyncHandler(
    async (
    req: Request,
    res: Response,
) => {
        const { restaurant, foodName, foodPrice } = req.body;

        if(!foodName || !foodPrice || !restaurant) {
            res.status(400).json({
                success: false,
                status: 400,
                message: "foodName, foodPrice, restaurant fields are required"
            });
        }

        //create food
        const food = new Food({
            foodName,
            foodPrice,
            restaurant,
        })

        const savedfood = await food.save();
        console.log('This food saved in db', savedfood);

        res.status(201).json({
            success: true,
            status: 201,
            message: 'Food Created Successfully',
            data: food
        })
});

/*
    Get all foods from a restaurant
*/

export const getFoodByRestaurantId = asyncHandler(
    async (
    req: Request,
    res: Response
) => {
        const id = req.params.id;
    
        if(!id) {
            res.status(400).json({
                success: false,
                status: 400,
                message: 'Param Restaurant ID is required',
            });
            return
        } else{

       // convert string -> ObjectId
        const restaurant = new mongoose.Types.ObjectId(id);

        const foods = await Food.find({ restaurant: restaurant }).populate('restaurant', 'restaurantName').select(' -createdAt -updatedAt -__v');

        res.status(200).json({
            success: true,
            status: 200,
            count: foods.length,
            message: 'Food Displayed By Restaurant Id',
            data: foods,
        })


        }

});

/* 
    Filter options
    Filter Foods from restaurant
*/
export const filterFoodByRestaurant = asyncHandler(
    async (
    req: Request,
    res: Response,
) => {
        const { restaurantName } = req.query;

        if(!restaurantName) {
            res.status(400).json({
            success: false,
            status: 400,
            message: "filter option 'restaurantName' is required'"
            });
        }

        const restaurant = await Restaurant.findOne({ restaurantName: restaurantName});

        if(!restaurant) {
            res.status(404).json({
                success: false,
                status: 400,
                message: 'Restaurant Not Found',
            })
        };

        const foods = await Food.find({
            restaurant: restaurant?._id
        } as any)
        .populate({
            path: 'restaurant',
            select: 'restaurantName'
        })
        .sort({ foodPrice: 1 })
        .select('-createdAt -updatedAt -__v');

        res.status(200).json({
            success: true,
            status: 200,
            message: 'Filtered Foods Successfully',
            data: foods,
        });
});