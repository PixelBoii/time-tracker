import { getH3User } from "../../../../utils/getH3User";
import { getPrismaClient } from "../../../../utils/getPrismaClient";

export default defineEventHandler(async (event) => {
    const prisma = getPrismaClient(event);

    const id = Number(event.context.params?.id);
    const user = await getH3User(event);

    if (!user) {
        throw createError({
            statusCode: 400,
            statusMessage: "Not logged in",
        });
    }

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: "No id provided",
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
            statusMessage: "No time record found",
        });
    }

    await prisma.timeRecord.delete({
        where: {
            id,
        },
    });

    return {
        message: "Time record deleted",
    };
});
