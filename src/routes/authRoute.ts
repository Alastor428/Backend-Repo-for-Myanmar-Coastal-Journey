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
import { verifyUserController } from '../middlewares/authMiddleware';
import { authorizeRoles } from '../middlewares/roleMiddleware';

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
    verifyUserController, 
    logoutUser
);

authRouter.get(
    '/users', 
    verifyUserController,
    getAllUser
);

authRouter.get(
    '/users/admin',
    verifyUserController,
    authorizeRoles('Admin'),
    getAllUser
);

authRouter.get(
    '/users/:id', 
    verifyUserController, 
    getUserById
);


export default authRouter;
