import { Router } from 'express';
import {
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
} from '../controllers/restaurantController';
import { authenticateToken } from '../middlewares/authMiddleware';

const restaurantRouter = Router();

restaurantRouter.post(
    '/',
    authenticateToken,
    createRestaurant
)

restaurantRouter.get(
    '/',
    authenticateToken,
    getAllRestaurants
)

restaurantRouter.get(
    '/:id',
    authenticateToken,
    getRestaurantById
)
export default restaurantRouter;
