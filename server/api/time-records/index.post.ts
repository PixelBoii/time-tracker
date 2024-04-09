import TimeRecordStatus from "../../../enums/TimeRecordStatus";
import { getH3User } from "../../../utils/getH3User";
import { getDb } from "../../../utils/getDb";
import { and, count, eq } from "drizzle-orm";
import { timeRecords } from "~/drizzle/schema";

export default defineEventHandler(async (event) => {
    const db = getDb(event);

    const user = await getH3User(event);

    if (!user) {
        throw createError({
            statusCode: 400,
            statusMessage: "Not logged in",
        });
    }

    const activeTimeRecords = await db
        .select({ count: count() })
        .from(timeRecords)
        .where(
            and(
                eq(timeRecords.userId, user.id),
                eq(timeRecords.status, TimeRecordStatus.STARTED),
            ),
        )
        .limit(1);

    if (activeTimeRecords.length && activeTimeRecords[0].count > 0) {
        throw createError({
            statusCode: 400,
            statusMessage: "Timer already started",
        });
    }

    const [createdTimeRecord] = await db
        .insert(timeRecords)
        .values({
            userId: user.id,
            status: TimeRecordStatus.STARTED,
            startAt: new Date().toISOString(),
        })
        .returning();

    return {
        data: createdTimeRecord,
    };
});
