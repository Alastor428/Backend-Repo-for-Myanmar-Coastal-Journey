import { Router } from 'express';
import {
    createBeach,
    createRegion,
} from '../controllers/beachController';
import { authenticateToken } from '../middlewares/authMiddleware';

const coastalRouter = Router();

coastalRouter.post(
    '/regions',
    authenticateToken,
    createRegion
)

coastalRouter.post(
    '/beaches',
    authenticateToken,
    createBeach
)

// BeachRouter.get(
//     '/beaches/:id',
// )

// BeachRouter.put(
//     '/beaches/update/:id',
// )

export default coastalRouter;