import { getRandomValues } from "uncrypto";

export function generateRandomString(length: number) {
    const charset =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = new Uint32Array(length);

    return Array.from(
        getRandomValues(values),
        (x) => charset[x % charset.length],
    ).join("");
}
