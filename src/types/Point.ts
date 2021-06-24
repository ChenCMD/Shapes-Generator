import uuid from 'uuidjs';

export interface Point {
    x: number
    y: number
}

export interface IdentifiedPoint extends Point {
    id: string
}

export function createIdentifiedPoint(parentID: string, x: number, y: number): IdentifiedPoint {
    return { id: `${parentID}-${uuid.generate()}`, x, y};
}