import { FetchError } from 'ofetch';

export default defineNuxtRouteMiddleware(async () => {
    if (useState("user").value) {
        return;
    }

    try {
        const newUser = await $fetch("/api/user", {
            headers: {
                cookie: useRequestHeaders(["cookie"]).cookie ?? "",
            },
        });

        if (newUser) {
            useState("user", () => newUser.data);
        }
    } catch (error) {
        if (error instanceof FetchError && error.response?.status === 400) {
            return;
        }

        console.error(error);
    }
});
