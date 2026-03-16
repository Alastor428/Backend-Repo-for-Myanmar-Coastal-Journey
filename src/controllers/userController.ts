import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import {
  registerUserService,
  loginUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
  refreshTokenService,
  generateToken,
} from '../services/authService';
import { CreateUserSchema, LogInSchema } from '../validations/authSchema';
import { parsePagination } from '../validations/commonSchema';
import { objectIdSchema } from '../validations/authSchema';

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const parsed = CreateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({
      success: false,
      status: 422,
      message: 'Invalid Credentials',
      errors: parsed.error.flatten(),
    });
    return;
  }

  const savedUser = await registerUserService(parsed.data);
  const accessToken = generateToken(res, savedUser._id.toString());

  res.status(201).json({
    success: true,
    status: 201,
    message: 'User Created Successfully',
    user: savedUser,
    accessToken,
  });
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const parsed = LogInSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({
      success: false,
      status: 422,
      message: 'Invalid Credentials',
      errors: parsed.error.flatten(),
    });
    return;
  }

  const user = await loginUserService(parsed.data);
  const accessToken = generateToken(res, user._id.toString());

  res.json({
    success: true,
    status: 200,
    message: 'User LogIn Successfully',
    user,
    accessToken,
  });
});

export const getAllUser = asyncHandler(async (req: Request, res: Response) => {
  const pagination = parsePagination(req.query);
  const result = await getAllUsersService(pagination.page, pagination.limit);

  res.status(200).json({
    success: true,
    status: 200,
    message: 'User Displayed',
    ...result,
  });
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const parsed = objectIdSchema.safeParse(req.params.id);
  if (!parsed.success) {
    res.status(422).json({
      success: false,
      status: 422,
      message: 'Invalid user ID',
      errors: parsed.error.flatten(),
    });
    return;
  }

  const user = await getUserByIdService(parsed.data);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'User Data Displayed',
    data: user,
  });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await updateUserService(req.params.id, req.body);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'User Updated Successfully',
    data: user,
  });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await deleteUserService(req.params.id);
  res.status(200).json({
    success: true,
    status: 200,
    message: 'User Deleted Successfully',
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.jwt;
  if (!refreshToken) {
    res.status(401).json({ success: false, message: 'No refresh token found' });
    return;
  }

  try {
    const { accessToken } = await refreshTokenService(refreshToken);
    res.status(200).json({ message: 'Access token refreshed', accessToken });
  } catch {
    res.status(403).json({
      success: false,
      message: 'Invalid or expired refresh token',
    });
  }
});

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.cookies?.jwt) {
    res.status(204).send();
    return;
  }

  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'none',
    secure: process.env.NODE_ENV === 'production',
  });

  res.json({ message: 'User Has Logout and cookie cleared' });
});
