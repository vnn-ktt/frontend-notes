import type { INote } from "..";

export function isNote (value: unknown): value is INote {
    return (
        typeof value === 'object' &&
        value !== null &&
        'id' in value &&
        'title' in value &&
        'content' in value &&
        typeof (value as any).id === 'string' &&
        typeof (value as any).title === 'string' &&
        typeof (value as any).content === 'string'
    )
}