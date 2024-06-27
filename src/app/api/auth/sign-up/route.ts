'use server';
import { SignupValidator } from '@/lib/validators/Validator';
import { getUserByEmail } from '@/services/user';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { createUser, updateUser } from '@/lib/db.user';
import { generateVerificationToken } from '@/lib/helpers/tokens';
import { sendVerificationEmail } from '@/lib/helpers/mail';

export async function POST(req: NextRequest) {
  try {
    if (req.method !== 'POST') {
      return NextResponse.json({ message: `Method ${req.method} Not Allowed` }, { status: 405 });
    }

    const body = await req.json();
    const validatedFields = SignupValidator.safeParse(body);
    if (!validatedFields.success) {
      return NextResponse.json({ error: 'Invalid fields!' }, { status: 400 });
    }
    const { email, password, firstname, username, lastname } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      if (existingUser.emailVerified) {
        return NextResponse.json({ error: 'User already exist. Please sign in to continue.' }, { status: 409 });
      }
      await updateUser(email, firstname, lastname, username, password);
    } else {
      await createUser(email, firstname, lastname, username, password);
    }

    const tokenType = 'Verify';
    const verificationToken = await generateVerificationToken(email, tokenType);
    await sendVerificationEmail(verificationToken.email, verificationToken.code, firstname, 'Confirm your Email');
    return NextResponse.json({ success: 'Confirmation email sent!', token: verificationToken.token }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
