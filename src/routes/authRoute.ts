import { Router } from 'express';
import {
    registerUser,
    loginUser,
    refresh,
    logoutUser,
    getAllUser,
    getUserById,
} from '../controllers/userController';
import { limiter } from '../lib/expressRateLimit';
import { authenticateToken } from '../middlewares/authMiddleware';
// import { authorizeRoles } from '../middlewares/roleMiddleware';

const authRouter = Router();

authRouter.post(
    '/register', 
    limiter, 
    registerUser
);

authRouter.post(
    '/login',
    loginUser
);

authRouter.post(
    '/refresh-token',
    refresh
);

authRouter.post(
    '/logout',
    authenticateToken, 
    logoutUser
);

authRouter.get(
    '/users', 
    authenticateToken,
    getAllUser
);

authRouter.get(
    '/users/admin',
    authenticateToken,
    // authorizeRoles('Admin'),
    getAllUser
);

authRouter.get(
    '/users/:id', 
    authenticateToken, 
    getUserById
);


export default authRouter;
