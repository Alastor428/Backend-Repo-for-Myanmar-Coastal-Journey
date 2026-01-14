import { comparePassword } from '../../auth/encryptPassword';
import { NotFoundError } from '../errors/notFoundError';
import { UnauthorizedError } from '../errors/unauthorizedError'
import { LogInType } from '../../validations/authSchema';
import { UserModel, getUserByEmail } from '../../models/userModel'
import { generateRefreshToken, generateAccessToken, TokenPayload, verifyRefreshToken } from '../../auth/jwt';

export async function loginService(data: LogInType) {
    // Find user by email
    const user = await getUserByEmail(data.email);

    if(!user) {
        throw new UnauthorizedError('Invalid email or password');
    }

    // check password
    const isPasswordValid = await comparePassword(data.password, user.password);

    if(!isPasswordValid) {
        throw new UnauthorizedError('Password is incorrect');
    }

    // Generate tokens
    const tokenPayload : TokenPayload = {
        _id: user._id.toString(),
        email: user.email,
        role: user.userRole,
    }

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    /* 
        store refresh token in database and return user data without password and refreshToken
    */
    const updateUser = (
        userId: string,
        refreshToken: string
    ) => {
        return UserModel.findByIdAndUpdate(
            userId,
            { refreshToken },
            {
                new: true,
                select: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    nrc: 1,
                    dateOfBirth: 1,
                    userRole: 1,
                    phone: 1,
                    password: 1,
                    verifyOtp: 1,
                    verifyOtpExpireAt: 1,
                    isAccountVerified: 1,
                    resetOtp: 1,
                    resetOtpExpireAt: 1,
                },
            },
        );

    };
    
    return {
        user: updateUser,
        accessToken,
        refreshToken,
    }
} // end of login service

export async function refreshTokenService(refreshToken: string) {
    // verify refresh token
    let payload: TokenPayload;
    try {
        payload = verifyRefreshToken(refreshToken);
    } catch (error) {
        throw new UnauthorizedError('Invalid refresh token');
    }

    // Find user and verify refresh token matches
    const user = await UserModel.find({
        _id: playload.userId ,
        select: {
            _id: 1,
            email: 1,
            role: 1,
            refreshToken: 1,
        },
    });

    if (!user || user?.authentication?.refreshToken !== refreshToken ) {
        throw new UnauthorizedError('Invalid refresh ;token');
    }

    // Generate **new tokens
    const tokenPayload : TokenPayload = {
        _id: user._id.toString(),
        email: user.email,
        role: user.userRole,
    }


}