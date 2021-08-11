import uuid from 'uuidjs';

export type Point = [x: number, y: number];

export interface IdentifiedPoint {
    id: string
    pos: Point
}

export interface ProcessedPoints<T = IdentifiedPoint> {
    name: string
    isManipulateShape: boolean
    isSelected: boolean
    points: T[]
}

export function createIdentifiedPoint(parentID: string, pos: Point): IdentifiedPoint {
    return { id: `${parentID}-${uuid.generate()}`, pos };
}

export function deleteDuplicatedPoints(shapes: ProcessedPoints[], threshold: number): ProcessedPoints[] {
    const res: ProcessedPoints<IdentifiedPoint & { isDuplicated?: boolean }>[] = shapes.filter(v => !v.isManipulateShape);
    if (threshold !== 0) {
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
    }
    res.push(...shapes.filter(v => v.isManipulateShape && v.isSelected));
    console.log(res.map(v => v.isManipulateShape));
    console.log(res.map(v => ({ ...v })).map(v => v.isManipulateShape));
    return res.map(v => ({ ...v, points: v.points.filter(v2 => !v2.isDuplicated) })) as ProcessedPoints[];
}