
import mongoose from 'mongoose';

export enum USEROLES {
    Admin = 'Admin',
    Client = 'Client',
}

export interface IUser extends Document {
  name: string;
  email: string;
  nrc: string;
  dateOfBirth?: Date;
  userRole: keyof typeof USEROLES | string;
  phone: string;
  password: string;
  confirmPassword: string;
  // Auth & OTP
  verifyToken?: string;
  verifyTokenExpireAt?: Date;
  isAccountVerified?: boolean;
  resetPassword?: string;
  resetPasswordExpireAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    nrc: {
        type: String,
        required: true,
        unique: true
    },
    dateOfBirth: {
        type: Date,  
    },
    userRole: {
        type: String,
        enum: Object.values(USEROLES),
        default: USEROLES.Client
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
        required: true,
    },
    //  Email Verification
    verifyToken: {
        type: String,
    },
    verifyTokenExpireAt: {
        type: Date,
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    resetPassword: {
        type: String,
    },
    resetPasswordExpireAt: {
        type: Date,
    },
  },
   { timestamps: true }

);

export const User = mongoose.model('User', userSchema);

// export const getUsers = () => UserModel.find();
// export const getUserByEmail = (email: string) => UserModel.findOne({ email });
// export const getUserByRefreshToken = (refreshToken: string) => UserModel.findOne({
//     'refreshToken': refreshToken,
// })
// export const getUserById = (id: string) => UserModel.findById(id);
// export const createUser = (values: Record<string, any>) => new UserModel(values).save().then((user) => user.toObject());
// export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id });
// export const updateUserById = (
//     id: string, 
//     values: Record<string, any>) => UserModel.findByIdAndUpdate(id, values);
