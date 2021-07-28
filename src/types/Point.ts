import uuid from 'uuidjs';

export type Point = [x: number, y: number];

export interface IdentifiedPoint {
    id: string
    pos: Point
}

export interface ProcessedPoints<T = IdentifiedPoint> {
    name: string
    isSelected: boolean
    points: T[]
}

export function createIdentifiedPoint(parentID: string, pos: Point): IdentifiedPoint {
    return { id: `${parentID}-${uuid.generate()}`, pos };
}

export function deleteDuplicatedPoints(shapes: ProcessedPoints[], threshold: number): ProcessedPoints[] {
    const res: ProcessedPoints<IdentifiedPoint & { isDuplicated?: boolean }>[] = shapes;
    for (const [i, { points: a }] of res.entries()) {
        for (const [j, { pos: [x1, y1], isDuplicated }] of a.entries()) {
            if (isDuplicated) continue;
            for (const [k, { points: b }] of res.entries()) {
                for (const [l, { pos: [x2, y2] }] of b.entries()) {
                    if ((i === k && j === l) || b[l].isDuplicated) continue;
                    b[l].isDuplicated = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) < threshold * threshold;
                }
            }
        }
    }
    return res.map(v => ({ ...v, points: v.points.filter(v2 => !v2.isDuplicated) })) as ProcessedPoints[];
}