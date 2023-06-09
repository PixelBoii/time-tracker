import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function getH3User(event: any) {
    const rememberMeToken = getCookie(event, 'rememberMeToken');

    if (!rememberMeToken) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Not logged in',
        });
    }

    return prisma.user.findFirst({
        where: {
            rememberMeToken,
        },
    });
}
