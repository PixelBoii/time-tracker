export function useFetchApi(url: string, options = {}) {
    return useFetch(url, {
        baseURL: 'http://localhost:3000/api',
        headers: {
            cookie: useRequestHeaders(['cookie']).cookie ?? '',
        },
        ...options,
    });
}