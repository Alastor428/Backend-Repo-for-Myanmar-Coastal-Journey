import { Router } from 'express';
import {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} from '../controllers/restaurantController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import {
  createRestaurantSchema,
  updateRestaurantSchema,
  listRestaurantsQuerySchema,
  getRestaurantByIdParamsSchema,
} from '../validations/restaurantSchema';

const restaurantRouter = Router();

restaurantRouter.post('/', authenticateToken, validate(createRestaurantSchema, 'body'), createRestaurant);
restaurantRouter.get('/', authenticateToken, validate(listRestaurantsQuerySchema, 'query'), getAllRestaurants);
restaurantRouter.get('/:id', authenticateToken, validate(getRestaurantByIdParamsSchema, 'params'), getRestaurantById);
restaurantRouter.put('/:id', authenticateToken, validate(getRestaurantByIdParamsSchema, 'params'), validate(updateRestaurantSchema, 'body'), updateRestaurant);
restaurantRouter.delete('/:id', authenticateToken, validate(getRestaurantByIdParamsSchema, 'params'), deleteRestaurant);

export default restaurantRouter;
