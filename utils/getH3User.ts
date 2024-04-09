import { eq } from "drizzle-orm";
import { getDb } from "./getDb";
import { users } from "../drizzle/schema";

export function getH3User(event: any) {
    const db = getDb(event);

    const rememberMeToken = getCookie(event, "rememberMeToken");

    if (!rememberMeToken) {
        throw createError({
            statusCode: 400,
            statusMessage: "Not logged in",
        });
    }

    return db.query.users.findFirst({
        where: eq(users.rememberMeToken, rememberMeToken),
    });
}
