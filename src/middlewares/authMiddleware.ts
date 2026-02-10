import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';


interface JWTPayload {
    id: string;
}

export const authenticateToken = asyncHandler(
    async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const authHeader = req.headers.authorization
    if(!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({
            message: 'Unauthorized'
        })
    }

    const token = authHeader?.split(' ')[1]

    jwt.verify (
        token as string,
        process.env.ACCESS_TOKEN_SECRET as string,
    )

    next();
    
});

