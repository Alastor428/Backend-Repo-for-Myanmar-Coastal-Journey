import * as z from 'zod';
import { USEROLES } from '../models/userModel';
import mongoose from 'mongoose';

export const objectIdSchema = z.string().refine(
  (val) => mongoose.Types.ObjectId.isValid(val),
  { message: 'Invalid MongoDB ObjectId' }
)

export const LogInSchema = z.object({
    email: z
    .email()
    .refine(val => val.endsWith("@gmail.com"), {
      message: "Email must end with '@gmail.com' "
    }),
    password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
});

export const CreateUserSchema = z.object({
  name: z
    .string()
    .min(3, 'Username is required'),
  email: z
    .email()
    .refine(val => val.endsWith('@gmail.com'), {
      message: 'Email must end with @gmail.com'
    }),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
  dateOfBirth: z
    .date()
    .optional(),
  userRole: z
    .enum(USEROLES, "Role must be one of 'Admin' or 'Client' ")
    .default(USEROLES.Client),
  phone: z
    .string()
    .min(9, 'Phone Numbers must be at least 9 characters')
    .refine(val => val.startsWith('09'), {
      message: 'Phone number must start with 09'
    })
    .optional()
    .nullable(),
  isAccountVerified: z
    .boolean()
    .optional()
    .nullish(),
  
});

export const UpdateUserSchema = z.object({
  name: z
    .string()
    .min(3, 'Username is required')
    .optional(),
  email: z
    .email()
    .refine(val => val.endsWith('@gmail.com'), {
        message: "Email must end with '@gmail.com' "
      })
    .optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
  dateOfBirth: z
    .date()
    .optional(),
  userRole: z
    .enum(USEROLES, "Role must be one of 'Admin' or 'Client' ")
    .optional(),
  phone: z
    .string()
    .optional(),
  isAccountVerified: z
    .boolean()
    .optional()
    .nullish(),
}).refine((data) => Object.keys(data).length > 0, {
  error: 'At least one field must be provided for update',
  path: ['name', 'email', 'password', 'dateOfBirth', 'userRole', 'phone', 'isAccountVerified']
})

export type objectIdType = z.infer<typeof objectIdSchema>;
export type LogInType = z.infer<typeof LogInSchema>;
export type CreateUserType = z.infer<typeof CreateUserSchema>;
export type UpdateUserType = z.infer<typeof UpdateUserSchema>;

