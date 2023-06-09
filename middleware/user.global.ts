export default defineNuxtRouteMiddleware(async () => {
    if (useState('user').value) {
        return;
    }

    try {
        const newUser = await $fetch('/api/user', {
            headers: {
                cookie: useRequestHeaders(['cookie']).cookie ?? '',
            },
        });

        if (newUser) {
            useState('user', () => newUser.data);
        }
    } catch (error) {
        console.error(error);
    }
});
