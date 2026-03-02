import { Router } from 'express';
import {
    createRoute,
    getAllRoute,
} from '../controllers/routeController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.post(
    '/',
    authenticateToken,
    createRoute
)

router.get(
    '/',
    authenticateToken,
    getAllRoute
)

export default router;