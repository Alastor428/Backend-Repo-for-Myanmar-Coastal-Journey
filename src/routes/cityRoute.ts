import { Router } from 'express';
import {
    createCity,
    getAllCity,
} from '../controllers/cityController';
import { authenticateToken } from '../middlewares/authMiddleware';

const cityRouter = Router();

cityRouter.post(
    '/',
    authenticateToken,
    createCity
)

cityRouter.get(
    '/',
    authenticateToken,
    getAllCity
)

export default cityRouter;