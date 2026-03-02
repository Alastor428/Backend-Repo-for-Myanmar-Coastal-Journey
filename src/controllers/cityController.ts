import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { City } from '../models/cityModel';

/*
    create new city
*/
export const createCity = asyncHandler(
    async (
    req: Request,
    res: Response,
) => {
        const { cityName } = req.body

        if(!cityName) {
            res.status(400).json({
                success: false,
                status: 400,
                message: "city field is required"
            });
        }

        //create city
        const city = new City({
            cityName,
        })

        const savedCity = await city.save();
        console.log('This city saved in db', savedCity);

        res.status(201).json({
            success: true,
            status: 201,
            message: 'City Created Successfully',
            data: city
        })
});


/*
    Get all cities
*/
export const getAllCity = asyncHandler(
    async (
    req: Request,
    res: Response,
) => {
       const allCityData = await City.find().sort({cityName: 1});

       if(!allCityData || allCityData.length === 0) {
            res.status(404)
            throw new Error('Beach Data Not Found');
       } 
    
        res.status(200).json({
            success: true,
            status: 200,
            message: 'City Displayed',
            data: allCityData,
        })
});
