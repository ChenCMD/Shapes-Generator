import uuid from 'uuidjs';

export type UUID = `${string}-${string}-${string}-${string}-${string}`;

export function generateUUID(): UUID {
    return uuid.generate() as UUID;
}

const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
export function isUUID(str: string): str is UUID {
    return uuidRegex.test(str);
}