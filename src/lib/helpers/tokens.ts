"use server"
import { getVerificationTokenByEmail } from '@/services/verification-token';
import jwt from 'jsonwebtoken';
import db from '../db';
import { generateRandomString } from './verificationCode';

export const generateVerificationToken = async (email: string) => {
  const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours in milliseconds
  const token = jwt.sign(
    { email, exp: expirationTime.getTime() },
    process.env.JWT_SECRET!,
    { algorithm: 'HS256' }
  );

  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const activitionCode = await generateRandomString();
  const expireCode = new Date(new Date().getTime() + 5 * 60 * 1000);

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      code: activitionCode,
      expires: expirationTime,
      expiresCode: expireCode,
    },
  });
  return verificationToken;
};


export const generateVerificationCode = async (email: string) => {
  const existingToken = await getVerificationTokenByEmail(email);
  if (!existingToken) {
    return { error: 'Forbidden' };
  }
  const activitionCode = await generateRandomString();
  const expireCode = new Date(new Date().getTime() + 5 * 60 * 1000);

  const verificationToken = await db.verificationToken.update({
    where: {id: existingToken.id},
    data: {
      code: activitionCode,
      expiresCode: expireCode,
    },
  });
  return verificationToken;
}