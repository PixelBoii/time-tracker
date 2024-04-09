// @ts-ignore
import bcrypt from "bcryptjs";
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

    if (!existingUser) {
        throw createError({
            statusCode: 400,
            statusMessage: "Invalid username or password",
        });
    }

    if (!existingUser.rememberMeToken) {
        existingUser.rememberMeToken = generateRandomString(32);

        await db
            .update(users)
            .set({
                rememberMeToken: existingUser.rememberMeToken,
            })
            .where(eq(users.id, existingUser.id));
    }

    const passwordMatches = bcrypt.compareSync(password, existingUser.password);

    if (!passwordMatches) {
        throw createError({
            statusCode: 400,
            statusMessage: "Invalid username or password",
        });
    }

    setCookie(event, "rememberMeToken", existingUser.rememberMeToken, {
        secure: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        httpOnly: true,
        sameSite: "lax",
    });

    return {
        data: {
            id: existingUser.id,
            username: existingUser.username,
        },
    };
});
