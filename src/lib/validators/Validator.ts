import { z } from 'zod';

export const SigninValidator = z.object({
  email: z.string().email({ message: 'Email is Required.' }),
  password: z.string().min(1, { message: 'Password is Required.' }),
});

export const SignupValidator = z
  .object({
    email: z.string().email({ message: 'Email is Required.' }),
    firstname: z
      .string()
      .min(1, { message: 'firstname must atleast 1 characters.' }),
    lastname: z
      .string()
      .min(1, { message: 'lastname must atleast 1 characters.' }),
    password: z
      .string()
      .min(6, { message: 'Password must atleast 6 characters.' }),
    CPassword: z.string(),
  })
  .refine((data) => data.password === data.CPassword, {
    message: "Confirmation password doesn't match!",
    path: ['CPassword'],
  });
