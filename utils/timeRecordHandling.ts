export const allowedFields = ["status", "startAt", "stopAt", "name", "notes"];

export const serializeFields: Record<string, (value: any) => any> = {
    notes: (value: object) => JSON.stringify(value),
};

export const parseFields: Record<string, (value: any) => any> = {
    notes: (value: string) => JSON.parse(value),
};

export function applyParsing(fields: object) {
    return Object.fromEntries(
        Object.entries(fields).map(([key, value]) => [
            key,
            key in parseFields ? parseFields[key](value) : value,
        ]),
    );
}

export function applySerialization(fields: object) {
    return Object.fromEntries(
        Object.entries(fields).map(([key, value]) => [
            key,
            key in serializeFields ? serializeFields[key](value) : value,
        ]),
    );
}
