import { PrismaClient } from '@prisma/client';
import { getH3User } from '../../../../utils/getH3User';

const prisma = new PrismaClient();

const allowedFields = [
    'status',
    'startAt',
    'stopAt',
    'name',
    'notes',
];

export default defineEventHandler(async (event) => {
    const id = Number(event.context.params?.id);
    const body = await readBody(event);
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

    const activeTimeRecord = await prisma.timeRecord.findFirst({
        where: {
            id,
        },
    });

    if (!activeTimeRecord) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Timer could not be found',
        });
    }

    const timeRecord = await prisma.timeRecord.update({
        where: {
            id,
        },
        data: Object.fromEntries(
            Object.entries(body)
                .filter(([key]) => allowedFields.includes(key))
        ),
    });

    return {
        data: timeRecord,
    };
});
