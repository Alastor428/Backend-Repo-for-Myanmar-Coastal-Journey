import { Router } from 'express';
import {
    createFood,
} from '../controllers/foodController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.post(
    '/',
    authenticateToken,
    createFood
)

export default router;
