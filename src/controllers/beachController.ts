import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Beach } from '../models/beachModel';
import { Region } from '../models/regionModel';

/*
    Create new Region
    Post /api/v1/regions
*/
export const createRegion = asyncHandler(
    async (
    req: Request,
    res: Response,
) => {
        const { regionName } = req.body;

        if(!regionName){
            res.status(400).json({
                success: false,
                status: 400,
                message: " 'RegionName' field is required"
            });
        }

        const region = new Region({
            regionName,
        })

        const savedRegion = await region.save();
        console.log('Region Saved in mongo: ', savedRegion);

        res.status(201).json({
            success: true,
            status: 201,
            message: 'Region Created Successfully',
            data: region
        })

        // check region exist
        const regionExists = await Region.findOne({ regionName })
        if(regionExists) {
            res.status(400).json({
                success: false,
                status: 400,
                message: 'Region Already Exist'
            })
        }
        
});


/*
    Create new beach
    Post /api/v1/beaches
*/
export const createBeach = asyncHandler(
    async (
    req: Request,
    res: Response,
) => {
        const { beachName, region, currentSafe, beachLocation, imageUrl } = req.body;
        
        if(!beachName || !region || !currentSafe || !beachLocation || !imageUrl ) {
            res.status(400).json({
                success: false,
                status: 400,
                message: "[beachName, region, currentSafe, beachLocation] all these fields are required"
            });
        }

        //create beach
        const beach = new Beach({
            beachName,
            region,
            currentSafe,
            beachLocation,
            imageUrl,
        })

        const savedBeach = await beach.save();
        console.log('This beach Saved in Mongo Altas', savedBeach);

        res.status(201).json({
            success: true,
            status: 201,
            message: 'Beach Created Successfully',
            data: beach
        })
});
    