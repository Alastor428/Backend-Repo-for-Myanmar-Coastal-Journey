import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Beach } from '../models/beachModel';
import { Region } from '../models/regionModel';

/*
    Create new Region
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
*/
export const createBeach = asyncHandler(
    async (
    req: Request,
    res: Response,
) => {
        const { beachName, region, currentSafe, imageUrl } = req.body;
        
        if(!beachName || !region || !currentSafe || !imageUrl ) {
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


/*
    Get all beaches
*/
export const getAllBeach = asyncHandler(
    async (
    req: Request,
    res: Response,
) => {
       const allBeachData = await Beach.find().populate('region','regionName').sort({beachName: 1});

       if(!allBeachData || allBeachData.length === 0) {
            res.status(400)
            throw new Error('Beach Data Not Found');
       } 
    
        res.status(200).json({
            success: true,
            status: 200,
            message: 'Beach Displayed',
            data: allBeachData,
        })
});


/*
    Handle image upload
*/

export const imageUploadController = asyncHandler(
    async (
    req: Request,
    res: Response,
) => {

        const files = req.files as Express.Multer.File[];

        if(!files || files.length === 0) {    
            res.status(400).json({
                success: false,
                status: 400,
                message: 'No image uploaded'
            })
            return;
        }

        const imageUrls = files.map(file => `http://localhost:3000/uploads/${file.filename}`);

        res.status(201).json({
            success: true,
            status: 201,
            message: 'Images Created',
            data: imageUrls,
        });
});


