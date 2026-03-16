import { Router } from 'express';
import {
  registerUser,
  loginUser,
  refresh,
  logoutUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { limiter } from '../lib/expressRateLimit';
import { authenticateToken } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { CreateUserSchema, LogInSchema, objectIdSchema, UpdateUserSchema } from '../validations/authSchema';
import { z } from 'zod';

const authRouter = Router();

const userIdParamsSchema = z.object({ id: objectIdSchema });

authRouter.post('/register', limiter, validate(CreateUserSchema, 'body'), registerUser);
authRouter.post('/login', validate(LogInSchema, 'body'), loginUser);
authRouter.post('/refresh-token', refresh);
authRouter.post('/logout', authenticateToken, logoutUser);
authRouter.get('/users', authenticateToken, getAllUser);
authRouter.get('/users/:id', authenticateToken, validate(userIdParamsSchema, 'params'), getUserById);
authRouter.put('/users/:id', authenticateToken, validate(userIdParamsSchema, 'params'), validate(UpdateUserSchema, 'body'), updateUser);
authRouter.delete('/users/:id', authenticateToken, validate(userIdParamsSchema, 'params'), deleteUser);

export default authRouter;
