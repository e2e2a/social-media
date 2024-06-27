"use server"
import db from '@/lib/db';
import { hashPassword } from '@/lib/helpers/bcrypt';

type INewUser = {
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  emailVerified: Date;
  password: string;
};

type IUpdateUserPassword = {
  userId: string;
  password: string;
};

export const createUser = async (data: INewUser) => {
  try {
    const hashedPassword = await hashPassword(data.password);
    const newUser = await db.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = db.user.findUnique({
      where: {
        email:email,
      },
    });
    return user;
  } catch (error) {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  } catch (error) {
    return null;
  }
};

// export const updateUserById = async (id: string, updateData:any) => {
//   try {
//     const user = await db.user.update({
//       where: {
//         id,
//       },
//       data: updateData
//     });
//     return user;
//   } catch (error) {
//     return null;
//   }
// };
// export const updateUserByEmail = async (email: string, updateData:any) => {
//   try {
//     const user = await db.user.update({
//       where: {
//         email,
//       },
//       data: updateData
//     });
//     return user;
//   } catch (error) {
//     return null;
//   }
// };

export const updateUserPasswordById = async (data: IUpdateUserPassword) => {
  try {
    // Extract data or can only extract 1 or more data
    const { userId, password } = data;
    const existingUser = await getUserById(userId);
    if (!existingUser) {
      throw new Error('Could not find user');
    }
    
    const hashedPassword = await hashPassword(password);

    const newPassword = await db.user.update({
      where: {
        id: existingUser?.id,
      },
      data: {
        password: hashedPassword,
      },
    });
    return newPassword;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
};