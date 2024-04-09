import { eq } from "drizzle-orm";
import { getH3User } from "../../utils/getH3User";
import { getDb } from "../../utils/getDb";
import { users } from "../../drizzle/schema";

export default defineEventHandler(async (event) => {
    const db = getDb(event);

    const user = await getH3User(event);

    if (!user) {
        throw createError({
            statusCode: 400,
            statusMessage: "Not logged in",
        });
    }

    await db
        .update(users)
        .set({
            rememberMeToken: null,
        })
        .where(eq(users.id, user.id));

    setCookie(event, "rememberMeToken", "");

    return {
        message: "Logged out",
    };
});
