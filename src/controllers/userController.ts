

import { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler';
import { User } from '../models/userModel';
import { mailtrapClient, mailtrapSender } from '../../mailtrap/mailTrapConfig';
import { CreateUserSchema, LogInSchema } from '../validations/authSchema'

/*
    Register new user
    POST /api/v1/users
*/
export const registerUser = asyncHandler(
    async (
    req: Request,
    res: Response,
) => {
        const createPayload = req.body;
        console.log("Request Body:", createPayload);
        const { name, email, password, confirmPassword , nrc, phone, dateOfBirth, userRole } = req.body;

        const parsedPayload = CreateUserSchema.safeParse(createPayload);

        console.log('zod validated parsePayload', parsedPayload);

        if(!name || !email || !password || !nrc || !phone || !confirmPassword ) {
            res.status(400).json({
                success: false,
                status: 400,
                message: 'Please provide all required fields (name, email, password, nrc, phone)'
            })
        }


        // check if user exists
        const userExists = await User.findOne({ email })
        if(userExists) {
            res.status(400).json({
                success: false,
                status: 400,
                message: 'User Already Exist'
            })
        }


        if(!parsedPayload.success) {
            res.status(422).json({
                success: false,
                status: 422,
                message: "Invalid Credentials",
                errors: parsedPayload.error.flatten(),
            });
            return;
            
        } else {
            //hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const hashedConfirmPassword = await bcrypt.hash(password, salt)
        const verifyToken = Math.floor(100000 + Math.random() * 900000).toString()
        console.log('user hash password', hashedPassword);
        console.log('user hash confirmPassword', hashedConfirmPassword);

        //create user
        const user = new User({
            name,
            email,
            nrc,
            dateOfBirth,
            userRole,
            phone,
            password: hashedPassword,
            confirmPassword: hashedConfirmPassword,
            verifyToken,
            verifyTokenExpireAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
           
        })

        const savedUser = await user.save();
        console.log('This user Saved', savedUser);
        //jwt
        generateToken(res, user.id);

        async function sendVerificationEmail(
            email: string, 
            verifyToken: string) {
            const mailtrapRecipients = [{email}]
                const mailtrapResponse = await mailtrapClient.send({
                    from: mailtrapSender,
                    to: mailtrapRecipients,
                    subject: "Verify Your Email!",
                    html: `emailVerificationTemplate`

                })
                
           
        };

        if(user) {
            res.status(201).json({
                success: true,
                status: 201,
                user,
                token: generateToken(res, user.id)
            })} else {
                res.status(400).json({
                    success: false,
                    status: 400,
                    message: 'Invalid User Data',
                })
            }
        

        res.status(201).json({ 
            success: true,
            status: 201,
            message: "User Created Successfully" 
        });
        }

        

}
);


/*
    Authenticate a user
    POST /api/v1/users/login
*/
export const loginUser = asyncHandler(
    async (
    req: Request,
    res: Response
) => {
        const { name, email, password } = req.body;
        const loginPayload = req.body;

        const parsedPayload = LogInSchema.safeParse(loginPayload);

        if(!name || !password) {
            res.status(400).json({
                message: 'name and password field is required'
            })
        }
        
        //check for user email
        const user = await User.findOne({ email })
        
        if(!parsedPayload.success){
             res.status(422).json({
                success: false,
                status: 422,
                message: "Invalid Credentials",
                errors: parsedPayload.error.flatten(),
            });``
            return;
        }

        if(user && (await bcrypt.compare(password, user.password))){
            res.json({
                success: true,
                status: 201,
                message: "User LogIn Successfully",
                user,
                token: generateToken(res, user.id)
            })
          
        } else{
            res.status(400).json({
                success: false,
                status: 400,
                message: 'Invalid Credentials'
            }) 
        }

        if(user){
            console.log("Request Body:", req.body);
        }

}
);

/* 
    Get all users
    Get /api/v1/users
*/
export const getAllUser = asyncHandler(
    async (
    req: Request,
    res: Response
) => {
    const allUserData = await User.find();

    if(!allUserData || allUserData.length === 0) {
        res.status(404);
        throw new Error('User Data Not Found');
    } 

        res.status(200).json({
            success: true,
            status: 200,
            message: 'User Displayed',
            data: allUserData,
        })

});

/* 
    Get a user
    Get /api/v1/users/userId
*/
export const getUserById = asyncHandler(
    async (
    req: Request,
    res: Response
) => {
        const id = req.params.id;
        const ExistedUser = await User.findById(id);
        if (!ExistedUser) {
            res.status(403)
            throw new Error("Invalid UserId. Wrong Parameter Passed")
        }else {
            res.status(200).json({ 
                success: true,
                status: 200,
                message: "User Data Displayed",
                data: ExistedUser,
         });
        }
        
}
);

/* 
    Get a user
    Get /api/v1/auth/users/refresh-token
    access Public - because access token has expired
*/
export const refresh = asyncHandler(
  async (req: Request, res: Response) => {

    const refreshToken = req.cookies?.jwt;

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        message: 'No refresh token found'
      });
      return;
    }

    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string
      ) as JwtPayload;
    } catch (error) {
      res.status(403).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
      return;
    }

    const foundUser = await User.findById(decoded.id)
      .select('-password -confirmPassword -verifyToken -resetPassword');

    if (!foundUser) {
      res.status(401).json({
        message: 'Unauthorized user'
      });
      return;
    }

    const accessToken = jwt.sign(
      {
        id: foundUser._id,
        type: 'accessToken'
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '25min' }
    );

    res.status(200).json({
      message: 'Access token refreshed',
      accessToken
    });
  }
);


// Genearate JWT
export const generateToken = (res: Response, id: string) => {
    const accessToken = jwt.sign(
        {  
            id,
            'Type': 'accessToken',
         },
        process.env.ACCESS_TOKEN_SECRET as string, 
        { expiresIn: '25min'}
    )

    const refreshToken = jwt.sign(
         {
            id,
            'Type': 'refreshToken',
        } ,
        process.env.REFRESH_TOKEN_SECRET as string, 
        { expiresIn: '1d'} //user need to login again for set duration when refreshToken Expired
    )

    //create secure cookie with refresh token
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none', //cross-site cookie 
        maxAge: 1 * 24 * 60 * 60 * 1000,  //cookie expiry
    })
    
    res.status(200).json({ 
        message: 'Take this accessToken for authorized access', 
        accessToken: accessToken })
}

// Get a user
// Get /api/v1/auth/logout
// access Public - to clear cookie if exists

export const logoutUser = asyncHandler(
    async (
    req: Request,
    res: Response
) => {
    const cookies = req.cookies

    if(!cookies?.jwt) {
         res.status(204) //no content
         return;
    }

    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'none',
        secure: process.env.NODE_ENV === 'production',
    })

    res.json({
        message: 'User Has Logout and cookie cleared'
    })
});