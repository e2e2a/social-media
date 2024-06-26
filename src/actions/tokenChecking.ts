'use server';
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
import { NextResponse } from 'next/server';

export const VerificationTokenSignUp = async (token: string, Ttype?: string | null) => {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!, {
      algorithms: ['HS256'],
    }) as jwt.JwtPayload;
    // Check if decoded token is null or undefined
    if (!decodedToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    const existingToken = await getVerificationTokenByEmail(decodedToken.email);
    if (!existingToken) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 });
    }

    const existingUser = await getUserByEmail(existingToken.email);
    switch (Ttype) {
      case 'reset-password':
        if (!existingUser || !existingUser.emailVerified) {
          console.log('hello')
          return NextResponse.json({ errorRecovery: 'User email is not verified. Redirecting to recovery page...' }, { status: 400 });
          // return { errorRecovery: 'User email is not verified. Redirecting to recovery page...' };
        }
        break;
      default:  
        break;
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return NextResponse.json({ error: 'Token has expired' }, { status: 400 });
    }

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ existingToken: existingToken }, { status:200});
  } catch (error: any) {
    NextResponse.json({ error: 'User email is not verified' }, { status: 400 });
    return NextResponse.redirect('/recovery',{
      status: 404});
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

export const mytestingActionQuery = () => {
  console.log('hello world')
}
