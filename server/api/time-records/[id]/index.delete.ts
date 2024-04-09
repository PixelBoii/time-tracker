import { getH3User } from "../../../../utils/getH3User";
import { getDb } from "../../../../utils/getDb";
import { and, eq } from "drizzle-orm";
import { timeRecords } from "~/drizzle/schema";

export default defineEventHandler(async (event) => {
    const db = getDb(event);

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

    const timeRecord = await db.query.timeRecords.findFirst({
        where: and(eq(timeRecords.userId, user.id), eq(timeRecords.id, id)),
    });

    if (!timeRecord) {
        throw createError({
            statusCode: 400,
            statusMessage: "No time record found",
        });
    }

    await db.delete(timeRecords).where(eq(timeRecords.id, id));

    return {
        message: "Time record deleted",
    };
});
