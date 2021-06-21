import uuid from 'uuidjs';

export interface Point {
    id: string
    x: number
    y: number
}

export function createPoint(parentID: string, x: number, y: number): Point {
    return { id: `${parentID}-${uuid.generate()}`, x, y};
}