'use server';
import { signIn } from '@/auth';
import db from '@/lib/db';
import { sendVerificationEmail } from '@/lib/helpers/mail';
import { generateVerificationCode } from '@/lib/helpers/tokens';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { getUserByEmail } from '@/services/user';
import {
  getVerificationTokenByEmail,
  getVerificationTokenByToken,
} from '@/services/verification-token';
import jwt from 'jsonwebtoken';

export const VerificationTokenSignUp = async (token: string) => {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!, {
      algorithms: ['HS256'],
    }) as jwt.JwtPayload;
    // Check if decoded token is null or undefined
    if (!decodedToken) {
      return { error: 'Invalid token' };
    }

    const existingToken = await getVerificationTokenByEmail(decodedToken.email);

    if (!existingToken) {
      return { error: 'Token not found' };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return { error: 'Token has expired' };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
      return { error: 'User not found' };
    }
    console.log('existingToken', existingToken);
    return { existingToken: existingToken };
  } catch (error: any) {
    console.error('Error verifying email verification token:', error);
    return {
      error: `Token expired!`,
    };
  }
};
interface TokenI {
  email: string;
  verificationCode: string;
}

export const VerificationCodeSignUp = async ({
  email,
  verificationCode,
}: TokenI) => {
  const userToken = await getVerificationTokenByEmail(email);
  if (!userToken) return { error: 'Somethings went wrong' };
  const hasExpired = new Date(userToken.expiresCode) < new Date();
  if (hasExpired) {
    return { error: 'Verification Code has expired' };
  }
  if (verificationCode !== userToken.code)
    return { error: 'Verification Code not match.' };

  const User = await getUserByEmail(userToken.email);
  if (!User) return { error: 'User not found' };
  await db.user.update({
    where: { id: User.id },
    data: {
      emailVerified: new Date(),
      email: User.email,
    },
  });

  await db.verificationToken.delete({
    where: { id: userToken.id },
  });

  return;
};

export const resendVerificationCode = async (email: string) => {
  const verification = await generateVerificationCode(email);
  if ('error' in verification) {
    return { error: 'Something went wrong.' };
  }
  const User = await getUserByEmail(verification.email);
  if (!User) return { error: 'User not found' };
  await sendVerificationEmail(
    verification.email,
    verification.code,
    User.firstname,
    'Resend Verification'
  );
  return verification;
};
