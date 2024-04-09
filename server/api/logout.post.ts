import { getH3User } from "../../utils/getH3User";
import { getPrismaClient } from "../../utils/getPrismaClient";

export default defineEventHandler(async (event) => {
    const prisma = getPrismaClient(event);

    const user = await getH3User(event);

    if (!user) {
        throw createError({
            statusCode: 400,
            statusMessage: "Not logged in",
        });
    }

    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            rememberMeToken: null,
        },
    });

    setCookie(event, "rememberMeToken", "");

    return {
        message: "Logged out",
    };
});
