export default defineNuxtRouteMiddleware(() => {
    const user = useState('user');

    if (!user.value) {
        return navigateTo('/login');
    }
});
