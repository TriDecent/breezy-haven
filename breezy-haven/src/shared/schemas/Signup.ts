import z from 'zod';

export const SignUpSchema = z
  .object({
    email: z.email({ error: 'Email must be a valid email' }).trim(),
    password: z
      .string()
      .min(8, { error: 'Password must be at least 8 characters' })
      .max(64, { error: 'Password must be at most 64 characters' })
      .regex(/[A-Z]/, {
        error: 'Password must contain at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        error: 'Password must contain at least one lowercase letter',
      })
      .regex(/[0-9]/, { error: 'Password must contain at least one number' })
      .regex(/[^A-Za-z0-9]/, {
        error: 'Password must contain at least one special character',
      })
      .trim(),
    confirmedPassword: z.string().trim(),
    fullName: z
      .string()
      .min(2, { error: 'Full name must be at least 2 characters' })
      .max(64, { error: 'Full name must be at most 64 characters' })
      .trim(),
  })
  .refine(data => data.password === data.confirmedPassword, {
    message: "Passwords don't match",
    path: ['confirmedPassword'],
  })
  .refine(data => data.password === data.confirmedPassword, {
    message: "Passwords don't match",
    path: ['password'],
  });

export type SignUp = z.infer<typeof SignUpSchema>;
export type PartialSignUp = Partial<SignUp>;
