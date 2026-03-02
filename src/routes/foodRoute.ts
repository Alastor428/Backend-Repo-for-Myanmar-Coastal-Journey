import { Router } from 'express';
import {
    createFood,
    getFoodByRestaurantId,
    filterFoodByRestaurant
} from '../controllers/foodController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.post(
    '/',
    authenticateToken,
    createFood
)

router.get(
    '/:id',
    authenticateToken,
    getFoodByRestaurantId
)

router.get(
    '/filter/op1',
    authenticateToken,
    filterFoodByRestaurant
)

export default router;
