import { getH3User } from "../../utils/getH3User";

export default defineEventHandler(async (event) => {
    const user = await getH3User(event);

    if (!user) {
        return {
            data: null,
        };
    }

    return {
        data: {
            id: user.id,
            username: user.username,
        },
    };
});
