import { getH3User } from "../../../../utils/getH3User";
import { getDb } from "../../../../utils/getDb";
import {
    allowedFields,
} from "../../../../utils/timeRecordHandling";
import { eq } from "drizzle-orm";
import { timeRecords } from "~/drizzle/schema";

export default defineEventHandler(async (event) => {
    const db = getDb(event);

    const id = Number(event.context.params?.id);
    const body = await readBody(event);
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

    const activeTimeRecord = await db.query.timeRecords.findFirst({
        where: eq(timeRecords.id, id),
    });

    if (!activeTimeRecord) {
        throw createError({
            statusCode: 400,
            statusMessage: "Timer could not be found",
        });
    }

    const [timeRecord] = await db
        .update(timeRecords)
        .set(
            Object.fromEntries(
                Object.entries(body).filter(([key]) =>
                    allowedFields.includes(key),
                ),
            ),
        )
        .where(eq(timeRecords.id, id))
        .returning();

    return {
        data: timeRecord,
    };
});
