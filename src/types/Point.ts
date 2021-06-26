import uuid from 'uuidjs';

export type Point = [x: number, y: number];

export interface IdentifiedPoint {
    id: string
    pos: Point
}

export function createIdentifiedPoint(parentID: string, pos: Point): IdentifiedPoint {
    return { id: `${parentID}-${uuid.generate()}`, pos };
}