import { hash as argonHash } from "argon2";
import { generateRandomString } from "../../utils/generateRandomString";
import { getPrismaClient } from "../../utils/getPrismaClient";

export default defineEventHandler(async (event) => {
    const prisma = getPrismaClient(event);

    const body = await readBody(event);

    const username = body.username;
    const password = body.password;

    if (!username || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: "Missing username or password",
        });
    }

    const existingUser = await prisma.user.findFirst({
        where: {
            username,
        },
    });

    if (existingUser) {
        throw createError({
            statusCode: 400,
            statusMessage: "Username already exists",
        });
    }

    const passwordHash = await argonHash(password);
    const rememberMeToken = generateRandomString(32);

    const user = await prisma.user.create({
        data: {
            username,
            password: passwordHash,
            rememberMeToken,
        },
    });

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
