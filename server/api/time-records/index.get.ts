import { PrismaClient } from '@prisma/client';
import { getH3User } from '../../../utils/getH3User';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const user = await getH3User(event);

    if (!user) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Not logged in',
        });
    }

    const timeRecords = await prisma.timeRecord.findMany({
        where: {
            userId: user.id,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return {
        data: timeRecords,
    };
});
