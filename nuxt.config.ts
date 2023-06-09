// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxtjs/tailwindcss',
    ],
    runtimeConfig: {
        baseApiUrl: process.env.NUXT_API_BASE_URL ?? 'http://localhost:3000',
    },
});
