'use server';

import { signIn } from '@/auth';
import { createUser, updateUser } from '@/lib/db.user';
import { sendVerificationEmail } from '@/lib/helpers/mail';
import { generateVerificationToken } from '@/lib/helpers/tokens';
import { SigninValidator, SignupValidator } from '@/lib/validators/Validator';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { getUserByEmail } from '@/services/user';
import { AuthError } from 'next-auth';
import { z } from 'zod';

export const SignInAction = async (data: z.infer<typeof SigninValidator>) => {
  const validatedFields = SigninValidator.safeParse(data);
  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }
  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'Email does not exist!' };
  }

  if (!existingUser.emailVerified) {
    // const verificationToken = await generateVerificationToken(existingUser.email);
    return { error: 'Email does not exist!' };
  }
  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error: any) {
    console.log('error', error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid Credentials!' };
        case 'AccessDenied':
          return { error: 'Please Verfiy your email!' };
        default:
          return { error: 'Something went wrong' };
      }
    }
    throw error;
  }
};

export const SignUpAction = async (data: z.infer<typeof SignupValidator>) => {
  const validatedFields = SignupValidator.safeParse(data);
  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { email, password, firstname, lastname } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    if (existingUser.emailVerified) {
      return {
        error: 'User already exist. Please sign in to continue.',
      };
    }
    await updateUser(email, firstname, lastname, password);
  } else {
    await createUser(email, firstname, lastname, password);
  }
  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(
    verificationToken.email,
    verificationToken.code,
    firstname,
    'Confirm your Email'
  );
  return { success: 'Confirmation email sent!', token: verificationToken.token };
};
