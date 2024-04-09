import { getPrismaClient } from "./getPrismaClient";

export function getH3User(event: any) {
    const prisma = getPrismaClient(event);

    const rememberMeToken = getCookie(event, "rememberMeToken");

    if (!rememberMeToken) {
        throw createError({
            statusCode: 400,
            statusMessage: "Not logged in",
        });
    }

    return prisma.user.findFirst({
        where: {
            rememberMeToken,
        },
    });
}
