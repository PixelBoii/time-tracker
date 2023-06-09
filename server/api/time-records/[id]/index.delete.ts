import { PrismaClient } from '@prisma/client';
import { getH3User } from '../../../../utils/getH3User';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const id = Number(event.context.params?.id);
    const user = await getH3User(event);

    if (!user) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Not logged in',
        });
    }

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'No id provided',
        });
    }

    const timeRecord = await prisma.timeRecord.findFirst({
        where: {
            userId: user.id,
            id,
        },
    });

    if (!timeRecord) {
        throw createError({
            statusCode: 400,
            statusMessage: 'No time record found',
        });
    }

    await prisma.timeRecord.delete({
        where: {
            id,
        },
    });

    return {
        message: 'Time record deleted',
    };
});
