"use server"
import db from '@/lib/db';

export const getResetPasswordTokenById = async (id: string) => {
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
}

export const deleteResetPasswordTokenById = async (id: string) => {
    try {
        const user = await db.user.delete({
            where: {
                id,
            },
        });
        return user;
    } catch (error) {
        return null;
    }
}

export const deleteResetPasswordTokenByEmail = async (email: string) => {
    try {
        const user = await db.resetPassword.delete({
            where: {
                email:email,
            },
        });
        return user;
    } catch (error) {
        return null;
    }
}