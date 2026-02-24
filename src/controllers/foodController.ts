import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Food } from '../models/foodModel';

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
            message: 'food Created Successfully',
            data: food
        })
});