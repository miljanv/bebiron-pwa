import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, { message: 'auth.fillAllFields' }).email({ message: 'auth.invalidEmail' }),
  password: z.string().min(1, { message: 'auth.fillAllFields' }),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    email: z.string().min(1, { message: 'auth.fillAllFields' }).email({ message: 'auth.invalidEmail' }),
    password: z.string().min(6, { message: 'auth.passwordMinLength' }),
    confirmPassword: z.string().min(1, { message: 'auth.fillAllFields' }),
    agreedToTerms: z.boolean().refine((v) => v === true, { message: 'auth.acceptTerms' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'auth.passwordsMismatch',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, { message: 'auth.fillAllFields' }).email({ message: 'auth.invalidEmail' }),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, { message: 'auth.passwordMinLength' }),
    confirmPassword: z.string().min(1, { message: 'auth.fillAllFields' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'auth.passwordsMismatch',
    path: ['confirmPassword'],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
