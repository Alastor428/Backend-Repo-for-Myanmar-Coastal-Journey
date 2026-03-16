import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/userModel';

interface JWTPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authenticateToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JWTPayload;
      req.userId = decoded.id;
    } catch {
      res.status(403).json({ message: 'Invalid or expired token' });
      return;
    }

    next();
  }
);

/** Requires user to be at least 12 years old (for booking). Use after authenticateToken. */
export const requireAgeForBooking = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(req.userId).select('dateOfBirth');
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    if (!user.dateOfBirth) {
      res.status(403).json({
        success: false,
        message: 'Please add your date of birth to your profile before booking.',
      });
      return;
    }

    const today = new Date();
    const birthDate = new Date(user.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 12) {
      res.status(403).json({
        success: false,
        message: 'You must be at least 12 years old to book.',
      });
      return;
    }

    next();
  }
);

