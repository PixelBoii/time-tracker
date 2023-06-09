export function useFetchApi(url: string, options = {}) {
    const config = useRuntimeConfig();

    return useFetch(url, {
        baseURL: `${config.baseApiUrl}/api`,
        headers: {
            cookie: useRequestHeaders(['cookie']).cookie ?? '',
        },
        ...options,
    });
}