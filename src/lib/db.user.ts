import { getUserByEmail } from '@/services/user';
import db from './db';
import { hashPassword } from './helpers/bcrypt';

export const createUser = async (
  email: string,
  firstname: string,
  lastname: string,
  password: string
) => {
  try {
    const hashedPassword = await hashPassword(password);
    const newUser = await db.user.create({
      data: {
        email,
        firstname,
        lastname,
        password: hashedPassword,
      },
    });
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
};

export const updateUser = async (
  email: string,
  firstname: string,
  lastname: string,
  password: string
) => {
  try {
    const existingUser = await getUserByEmail(email);
    const hashedPassword = await hashPassword(password);
    const newUser = await db.user.update({
      where: {
        id: existingUser?.id,
      },
      data: {
        email,
        firstname,
        lastname,
        password: hashedPassword,
      },
    });
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
};
