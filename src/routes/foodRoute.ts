import { Router } from 'express';
import {
  createFood,
  getFoodByRestaurantId,
  getFoodById,
  updateFood,
  deleteFood,
  filterFoodByRestaurant,
} from '../controllers/foodController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import {
  createFoodSchema,
  updateFoodSchema,
  getFoodByRestaurantParamsSchema,
  getFoodByIdParamsSchema,
  filterFoodByRestaurantQuerySchema,
  listFoodsByRestaurantQuerySchema,
} from '../validations/foodSchema';

const router = Router();

router.post('/', authenticateToken, validate(createFoodSchema, 'body'), createFood);
router.get(
  '/filter/op1',
  authenticateToken,
  validate(filterFoodByRestaurantQuerySchema, 'query'),
  filterFoodByRestaurant
);
// GET/PUT/DELETE /foods/item/:id = single food by food id (must be before /:id)
router.get('/item/:id', authenticateToken, validate(getFoodByIdParamsSchema, 'params'), getFoodById);
router.put('/item/:id', authenticateToken, validate(getFoodByIdParamsSchema, 'params'), validate(updateFoodSchema, 'body'), updateFood);
router.delete('/item/:id', authenticateToken, validate(getFoodByIdParamsSchema, 'params'), deleteFood);
// GET /foods/:id = list foods by restaurant id (API compatibility)
router.get(
  '/:id',
  authenticateToken,
  validate(getFoodByRestaurantParamsSchema, 'params'),
  validate(listFoodsByRestaurantQuerySchema, 'query'),
  getFoodByRestaurantId
);

export default router;
