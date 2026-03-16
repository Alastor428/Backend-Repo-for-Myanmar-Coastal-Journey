import * as z from 'zod';
import { USEROLES } from '../models/userModel';
import { objectIdSchema } from './commonSchema';

export { objectIdSchema };

// User roles as tuple for z.enum (Zod v4 compatibility)
const USER_ROLES = [USEROLES.Admin, USEROLES.Client] as const;

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

const nrcRegex = /^(?:[1-9]|1[0-4])\/[A-Z]{3,}\((?:N|P|E)\)\d{6}$/;
// Passport: alphanumeric, 6-20 chars (international formats vary)
const passportRegex = /^[A-Za-z0-9]{6,20}$/;

export const CreateUserSchema = z
  .object({
    name: z.string().min(3, 'Username is required'),
    email: z
      .email('Invalid email address'),
    isForeigner: z.boolean().default(false),
    nrc: z
      .string()
      .regex(nrcRegex, 'Invalid NRC format (e.g. 12/ABC(N)123456)')
      .min(15, 'NRC must have at least 15 characters')
      .optional(),
    passport: z
      .string()
      .regex(passportRegex, 'Invalid passport format (6-20 alphanumeric characters)')
      .min(6, 'Passport must be at least 6 characters')
      .max(20, 'Passport must be at most 20 characters')
      .optional(),
    password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  confirmPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
  dateOfBirth: z.coerce.date({ message: 'Date of birth is required and must be a valid date' }),
  userRole: z
    .enum(USER_ROLES)
    .default(USEROLES.Client),
  phone: z.string().min(7, 'Phone number must be at least 7 characters'),
  isAccountVerified: z.boolean().optional().nullish(),
})
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine(
    (data) => {
      if (data.isForeigner) {
        return !!data.passport && data.passport.length >= 6;
      }
      return !!data.nrc && data.nrc.length >= 15;
    },
    {
      message: 'Local users: NRC is required. Foreign users: Passport is required.',
      path: ['nrc'],
    }
  )
  .refine(
    (data) => {
      if (data.isForeigner) return /^[+]?[0-9\s-]{7,20}$/.test(data.phone); // International
      return data.phone.startsWith('09'); // Local: Myanmar format
    },
    {
      message: 'Local users: phone must start with 09. Foreign users: use international format (e.g. +1234567890).',
      path: ['phone'],
    }
  )
  .refine(
    (data) => {
      const today = new Date();
      const birthDate = new Date(data.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= 12;
    },
    {
      message: 'You must be at least 12 years old to use this app.',
      path: ['dateOfBirth'],
    }
  );


export const UpdateUserSchema = z
  .object({
    name: z.string().min(3, 'Username is required').optional(),
    email: z
      .email('Invalid email address')
      .optional(),
    isForeigner: z.boolean().optional(),
    nrc: z
      .string()
      .regex(nrcRegex, 'Invalid NRC format (e.g. 12/ABC(N)123456)')
      .optional(),
    passport: z
      .string()
      .regex(passportRegex, 'Invalid passport format (6-20 alphanumeric characters)')
      .min(6)
      .max(20)
      .optional(),
    password: z.string().min(8, 'Password must be at least 8 characters').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character').optional(),
    dateOfBirth: z.coerce.date().optional(),
    userRole: z.enum(USER_ROLES).optional(),
    phone: z.string().min(7).optional(),
    isAccountVerified: z.boolean().optional().nullish(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
    path: ['name'],
  })
  .refine(
    (data) => {
      if (!data.dateOfBirth) return true;
      const today = new Date();
      const birthDate = new Date(data.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= 12;
    },
    {
      message: 'User must be at least 12 years old.',
      path: ['dateOfBirth'],
    }
  );

export type objectIdType = z.infer<typeof objectIdSchema>;
export type LogInType = z.infer<typeof LogInSchema>;
export type CreateUserType = z.infer<typeof CreateUserSchema>;
export type UpdateUserType = z.infer<typeof UpdateUserSchema>;

