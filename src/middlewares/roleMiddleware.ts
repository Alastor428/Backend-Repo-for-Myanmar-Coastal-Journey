// import asyncHandler from 'express-async-handler';
// import { Request, Response, NextFunction } from 'express';


// export const authorizeRoles = (...roles: string[]) => {
//     return (req: Request, res: Response, next: NextFunction) => {
//         const userRole = req.user.role; // coming from verifyUserController

//         if (!roles.includes(userRole)) {
//             return res.status(403).json({
//                 success: false,
//                 status: 403,
//                 message: 'Access denied'
//             });
//         }

//         next(); // important
//     };
// };