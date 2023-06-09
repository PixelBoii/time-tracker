import { PrismaClient } from '@prisma/client';
import { verify as argonVerify } from 'argon2';
import { generateRandomString } from '../../utils/generateRandomString';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const username = body.username;
    const password = body.password;

    if (!username || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing username or password',
        });
    }

    const existingUser = await prisma.user.findFirst({
        where: {
            username,
        },
    });

    if (!existingUser) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid username or password',
        });
    }

    if (!existingUser.rememberMeToken) {
        existingUser.rememberMeToken = generateRandomString(32);

        await prisma.user.update({
            where: {
                id: existingUser.id,
            },
            data: {
                rememberMeToken: existingUser.rememberMeToken,
            },
        });
    }

    const passwordMatches = await argonVerify(existingUser.password, password);

    if (!passwordMatches) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid username or password',
        });
    }

    setCookie(event, 'rememberMeToken', existingUser.rememberMeToken);

    return {
        data: {
            id: existingUser.id,
            username: existingUser.username,
        },
    };
});

