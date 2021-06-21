import uuid from 'uuidjs';

export interface Point {
    id: string
    x: number
    y: number
    distance: number
}

export function createPoint(parentID: string, x: number, y: number): Point {
    const distance = Math.sqrt(x * x + y * y);
    return { id: `${parentID}-${uuid.generate()}`, x, y, distance };
}