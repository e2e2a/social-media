'use server';
import db from '@/lib/db';
import { hashPassword } from '@/lib/helpers/bcrypt';
import { deleteResetPasswordTokenByEmail } from './reset-password';
import { deleteVerificationTokenByEmail } from './verification-token';

type INewUser = {
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  password: string;
};

type IUpdateUserPassword = {
  userId: string;
  password: string;
};

type IUpdateUserProfile = {
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  password: string;
}

export const createUser = async (data: INewUser) => {
  try {
    const {password, ...userData}= data
    const hashedPassword = await hashPassword(password);
    const newUser = await db.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
};

export const getUsers = async () => {
  const users = await db.user.findMany();
  return users;
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = db.user.findUnique({
      where: {
        email: email,
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
/**
 * @todo
 */
export const deleteUserByEmail = async (email:string) => {
  const existingUser = await getUserByEmail(email);
  if(existingUser){
    if(existingUser.emailVerified){
      await deleteVerificationTokenByEmail(email)
      await deleteResetPasswordTokenByEmail(email)
    }
  }
  await db.user.delete({
    where:{
      email:email
    }
  })
  return;
}

// export const updateUserInSignUp = async (updateData:IUpdateUserRegister) => {
//   try {
//     const {password, userId, ...data} = updateData
//     const existingUser = await getUserById(updateData.email);
//     const hashedPassword = await hashPassword(password);
//     const user = await db.user.update({
//       where: {
//         id: userId
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
//         email: email,
//       },
//       data: updateData
//     });
//     return user;
//   } catch (error) {
//     return null;
//   }
// };

// export const getUserProfile = async (username: string,
//   lastname: string,) => {
//   try {
//     const user = db.user.findMany({
//       where: {
//         username,
//       },
//     });
//     console.log('userserver:', user)
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
