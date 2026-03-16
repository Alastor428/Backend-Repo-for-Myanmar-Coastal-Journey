import { Router } from 'express';
import { createRoute, getAllRoute, getRouteById, updateRoute, deleteRoute } from '../controllers/routeController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { createRouteSchema, updateRouteSchema, listRoutesQuerySchema, getRouteByIdParamsSchema } from '../validations/routeSchema';

const router = Router();

router.post('/', authenticateToken, validate(createRouteSchema, 'body'), createRoute);
router.get('/', authenticateToken, validate(listRoutesQuerySchema, 'query'), getAllRoute);
router.get('/:id', authenticateToken, validate(getRouteByIdParamsSchema, 'params'), getRouteById);
router.put('/:id', authenticateToken, validate(getRouteByIdParamsSchema, 'params'), validate(updateRouteSchema, 'body'), updateRoute);
router.delete('/:id', authenticateToken, validate(getRouteByIdParamsSchema, 'params'), deleteRoute);

export default router;
