'use server';
import { getUserByEmail } from '@/services/user';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { getVerificationTokenByEmail } from '@/services/verification-token';

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json(
      { message: `Method ${req.method} Not Allowed` },
      { status: 405 }
    );
  }
  const body = await req.json();
  const { email, verificationCode } = body;
  const userToken = await getVerificationTokenByEmail(email);
  if (!userToken)
    return NextResponse.json({ error: 'Somethings went wrong' }, { status: 403 });

  const hasExpired = new Date(userToken.expiresCode) < new Date();
  if (hasExpired)
    return NextResponse.json(
      { error: 'Verification Code has expired.' },
      { status: 410 }
    );

  if (verificationCode !== userToken.code)
    return NextResponse.json(
      { error: 'Verification Code not match.' },
      { status: 403 }
    );

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

  return NextResponse.json({ status: 200 });
}