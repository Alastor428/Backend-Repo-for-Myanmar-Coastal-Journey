import bcrypt from 'bcrypt';
import jwt, { JwtPayload, type SignOptions } from 'jsonwebtoken';
import { Response } from 'express';
import { User } from '../models/userModel';
import { mailtrapClient, mailtrapSender } from '../../mailtrap/mailTrapConfig';
import { emailVerificationTemplate } from '../../mailtrap/emailTemplate';
import type { CreateUserType, LogInType, UpdateUserType } from '../validations/authSchema';

/**
 * JWT lifetimes (jsonwebtoken `expiresIn`). Override per environment.
 * - Shorter access token = smaller window if leaked; users refresh more often.
 * - Longer refresh = fewer re-logins; store httpOnly + secure cookie.
 */
const ACCESS_TOKEN_EXPIRES_IN = (process.env.ACCESS_TOKEN_EXPIRES_IN ?? '7d') as NonNullable<
  SignOptions['expiresIn']
>;
const REFRESH_TOKEN_EXPIRES_IN = (process.env.REFRESH_TOKEN_EXPIRES_IN ?? '30d') as NonNullable<
  SignOptions['expiresIn']
>;

/** Match refresh-token cookie maxAge to the refresh JWT (`expiresIn`: seconds if number, else s/m/h/d string). */
function jwtExpiresInToCookieMaxAgeMs(expiresIn: NonNullable<SignOptions['expiresIn']>): number {
  if (typeof expiresIn === 'number') return expiresIn * 1000;
  const m = /^(\d+)([smhd])$/i.exec(String(expiresIn).trim());
  if (!m) return 30 * 24 * 60 * 60 * 1000;
  const n = parseInt(m[1], 10);
  const unit = m[2].toLowerCase();
  const seconds =
    unit === 's' ? n : unit === 'm' ? n * 60 : unit === 'h' ? n * 3600 : n * 24 * 3600;
  return seconds * 1000;
}

export const registerUserService = async (data: CreateUserType) => {
  const userExists = await User.findOne({ email: data.email });
  if (userExists) throw new Error('User Already Exist');

  if (data.isForeigner) {
    const passportExists = await User.findOne({ passport: data.passport });
    if (passportExists) throw new Error('Passport already registered');
  } else {
    const nrcExists = await User.findOne({ nrc: data.nrc });
    if (nrcExists) throw new Error('NRC already registered');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);
  const hashedConfirmPassword = await bcrypt.hash(data.password, salt);
  const verifyToken = Math.floor(100000 + Math.random() * 900000).toString();

  const user = new User({
    name: data.name,
    email: data.email,
    isForeigner: data.isForeigner,
    nrc: data.isForeigner ? undefined : data.nrc,
    passport: data.isForeigner ? data.passport : undefined,
    dateOfBirth: data.dateOfBirth,
    userRole: data.userRole,
    phone: data.phone,
    password: hashedPassword,
    confirmPassword: hashedConfirmPassword,
    verifyToken,
    verifyTokenExpireAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  const savedUser = await user.save();

  // const html = emailVerificationTemplate.replace('{verifyCode}', verifyToken);
  // await mailtrapClient.send({
  //   from: mailtrapSender,
  //   to: [{ email: data.email }],
  //   subject: 'Verify Your Email!',
  //   html,
  // });

  return savedUser;
};

export const loginUserService = async (data: LogInType) => {
  const user = await User.findOne({ email: data.email });
  if (!user || !(await bcrypt.compare(data.password, user.password))) {
    throw new Error('Invalid Credentials');
  }
  const safe = await User.findById(user._id)
    .select('-password -confirmPassword -verifyToken -resetPassword')
    .lean();
  if (!safe) throw new Error('Invalid Credentials');
  return safe;
};

export const getAllUsersService = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find()
      .select('-password -confirmPassword -verifyToken -resetPassword')
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(),
  ]);
  return { data: users, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getUserByIdService = async (id: string) => {
  const user = await User.findById(id).select('-password -confirmPassword -verifyToken -resetPassword');
  if (!user) throw new Error('Invalid UserId. Wrong Parameter Passed');
  return user;
};

export const updateUserService = async (id: string, data: UpdateUserType) => {
  const updateData: Record<string, unknown> = { ...data };
  const unsetData: Record<string, 1> = {};
  if (data.password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(data.password, salt);
    updateData.confirmPassword = updateData.password;
  }
  // When switching user type: clear the other identity field
  if (data.isForeigner === true) {
    delete updateData.nrc;
    unsetData.nrc = 1;
  } else if (data.isForeigner === false) {
    delete updateData.passport;
    unsetData.passport = 1;
  }
  const updateOp: Record<string, unknown> = Object.keys(unsetData).length
    ? { $set: updateData, $unset: unsetData }
    : { $set: updateData };
  const user = await User.findByIdAndUpdate(id, updateOp, { new: true })
    .select('-password -confirmPassword -verifyToken -resetPassword');
  if (!user) throw new Error('Invalid UserId. Wrong Parameter Passed');
  return user;
};

export const deleteUserService = async (id: string) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new Error('Invalid UserId. Wrong Parameter Passed');
  return user;
};

export const refreshTokenService = async (refreshToken: string) => {
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as JwtPayload;
  const foundUser = await User.findById(decoded.id).select('-password -confirmPassword -verifyToken -resetPassword');
  if (!foundUser) throw new Error('Unauthorized user');

  const accessToken = jwt.sign(
    { id: foundUser._id, type: 'accessToken' },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );
  return { accessToken };
};

export const generateToken = (res: Response, id: string): string => {
  const accessToken = jwt.sign(
    { id, type: 'accessToken' },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { id, type: 'refreshToken' },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );

  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: jwtExpiresInToCookieMaxAgeMs(REFRESH_TOKEN_EXPIRES_IN),
  });

  return accessToken;
};
