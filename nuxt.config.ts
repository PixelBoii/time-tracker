import TwTypography from "@tailwindcss/typography";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ["nitro-cloudflare-dev", "@nuxtjs/tailwindcss"],
    runtimeConfig: {
        public: {
            baseApiUrl:
                process.env.NUXT_API_BASE_URL ?? "http://localhost:3000",
        },
    },
    tailwindcss: {
        config: {
            plugins: [TwTypography],
        },
    },
    nitro: {
        preset: "cloudflare-pages",
    },
});
