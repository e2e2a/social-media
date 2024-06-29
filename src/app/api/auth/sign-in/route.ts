import { SigninValidator } from '@/lib/validators/Validator';
import { getUserByEmail } from '@/services/user';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { getIpAddress } from '@/lib/helpers/getIp';
import rateLimit from '@/lib/helpers/rate-limit-test';
import { headers } from 'next/headers';

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
  }

  try {
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for');
    if (!ip) {
      return NextResponse.json({ error: 'Rate limit exceeded:' }, { status: 429 });
    }
    try {
      const myLimitTest = await rateLimit(ip);
      console.log('ipRequestCounts', myLimitTest.ipRequestCounts)
      if (myLimitTest?.error) {
        return NextResponse.json({ error: myLimitTest.error }, { status: 429 });
      }
      console.log(myLimitTest.ip?.toString());
    } catch (error) {
      console.error('Rate limit exceeded:', error);
      return NextResponse.json({ error: 'Rate limit exceeded:' }, { status: 429 });
    }
    // const ipAddress = await getIpAddress();
    // if (!ipAddress.success) {
    //   return NextResponse.json(
    //     { error: 'Your requesting too much, please try again a couple of minutes.' },
    //     { status: 429 }
    //   );
    // }
    const body = await req.json();
    const validatedFields = SigninValidator.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json({ error: 'Invalid fields!' }, { status: 400 });
    }

    const { email, password } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
      return NextResponse.json({ error: 'Email does not exist!' }, { status: 400 });
    }

    if (!existingUser.emailVerified) {
      return NextResponse.json({ error: 'Email not found.' }, { status: 403 });
    }

    try {
      await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      return NextResponse.json({ message: 'Login successful' }, { status: 200 });
    } catch (error: any) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return NextResponse.json({ error: 'Password not match!' }, { status: 401 });
          case 'AccessDenied':
            return NextResponse.json({ error: 'Access denied!' }, { status: 403 });
          default:
            return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
        }
      }
      throw error;
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
