import { hash as argonHash } from "argon2";
import { eq } from "drizzle-orm";
import { generateRandomString } from "../../utils/generateRandomString";
import { getDb } from "../../utils/getDb";
import { users } from "../../drizzle/schema";

export default defineEventHandler(async (event) => {
    const db = getDb(event);

    const body = await readBody(event);

    const username = body.username;
    const password = body.password;

    if (!username || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: "Missing username or password",
        });
    }

    const existingUser = await db.query.users.findFirst({
        where: eq(users.username, username),
    });

    if (existingUser) {
        throw createError({
            statusCode: 400,
            statusMessage: "Username already exists",
        });
    }

    const passwordHash = await argonHash(password);
    const rememberMeToken = generateRandomString(32);

    const [user] = await db
        .insert(users)
        .values({
            username,
            password: passwordHash,
            rememberMeToken,
        })
        .returning();

    setCookie(event, "rememberMeToken", rememberMeToken, {
        secure: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        httpOnly: true,
        sameSite: "lax",
    });

    return {
        data: {
            id: user.id,
            username: user.username,
        },
    };
});
