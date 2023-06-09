import { PrismaClient } from '@prisma/client';
import TimeRecordStatus from "../../../enums/TimeRecordStatus";
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

    const activeTimeRecords = await prisma.timeRecord.count({
        where: {
            userId: user.id,
            status: TimeRecordStatus.STARTED,
        },
    });

    if (activeTimeRecords > 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Timer already started',
        });
    }

    const timeRecord = await prisma.timeRecord.create({
        data: {
            userId: user.id,
            status: TimeRecordStatus.STARTED,
            startAt: new Date(),
        },
    });

    return {
        data: timeRecord,
    };
});
