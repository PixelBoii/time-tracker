import { desc, eq } from "drizzle-orm";
import { getH3User } from "../../../utils/getH3User";
import { getDb } from "../../../utils/getDb";
import { applyParsing } from "../../../utils/timeRecordHandling";
import { timeRecords } from "../../../drizzle/schema";

export default defineEventHandler(async (event) => {
    const db = getDb(event);

    const user = await getH3User(event);

    if (!user) {
        throw createError({
            statusCode: 400,
            statusMessage: "Not logged in",
        });
    }

    const foundTimeRecords = await db.query.timeRecords.findMany({
        where: eq(timeRecords.userId, user.id),
        orderBy: desc(timeRecords.createdAt),
    });

    return {
        data: foundTimeRecords.map(applyParsing),
    };
});
