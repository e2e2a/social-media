import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/services/user';
import { getVerificationTokenByEmail } from '@/services/verification-token';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    if (req.method !== 'POST') {
      return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
    }

    const body = await req.json();
    const { token } = body;

    // Verify the JWT token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!, {
      algorithms: ['HS256'],
    }) as jwt.JwtPayload;

    // Check if decoded token is null or undefined
    if (!decodedToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    // Retrieve verification token by email
    const existingToken = await getVerificationTokenByEmail(decodedToken.email);
    if (!existingToken) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 });
    }
    
    // Retrieve user by email
    const existingUser = await getUserByEmail(existingToken.email);

    // // Handle different verification types
    // switch (Ttype) {
    //   case 'reset-password':
    //     if (!existingUser || !existingUser.emailVerified) {
    //       return NextResponse.json(
    //         { error: 'User email is not verified. Redirecting to recovery page...' },
    //         { status: 400 }
    //       );
    //     }
    //     break;
    //   default:
    //     break;
    // }
    switch (existingToken.tokenType) {
      case 'Recovery':
        console.log('Recovery')
        if (!existingUser || !existingUser.emailVerified) {
          return NextResponse.json(
            { error: 'User email is not verified. Redirecting to recovery page...' },
            { status: 400 }
          );
        }
        break;
      case 'Verify':
        console.log('Verify')
        if (!existingUser) {
          return NextResponse.json(
            { error: 'User not found.' },
            { status: 400 }
          );
        }
    }

    // Check if token has expired
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return NextResponse.json({ error: 'Token has expired' }, { status: 400 });
    }

    // If all checks pass, return success response
    return NextResponse.json({ existingToken: existingToken }, { status: 200 });
  } catch (error: any) {
    
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
