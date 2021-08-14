import uuid from 'uuidjs';

export interface Point {
    x: number
    y: number
}

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

export function calcPoint(point: Point, calc: (p: number) => number): Point;
export function calcPoint(a: Point, b: Point, calc: (ap: number, bp: number) => number): Point;
export function calcPoint(a: Point, b: Point, c: Point, calc: (ap: number, bp: number, cp: number) => number): Point;
export function calcPoint(a: Point, b: Point | ((ap: number) => number), c?: Point | ((ap: number, bp: number) => number), calc?: (ap: number, bp: number, cp: number) => number): Point {
    if (typeof b === 'function')
        return { x: b(a.x), y: b(a.y) };
    if (typeof c === 'function')
        return { x: c(a.x, b.x), y: c(a.y, b.y) };
    if (c && typeof calc === 'function')
        return { x: calc(a.x, b.x, c.x), y: calc(a.y, b.y, c.y) };
    return { x: 0, y: 0 };
}

export function createIdentifiedPoint(parentID: string, pos: Point): IdentifiedPoint {
    return { id: `${parentID}-${uuid.generate()}`, pos };
}

export function deleteDuplicatedPoints(shapes: ProcessedPoints[], threshold: number): ProcessedPoints[] {
    const res: ProcessedPoints<IdentifiedPoint & { isDuplicated?: boolean }>[] = shapes.filter(v => !v.isManipulateShape);
    if (threshold !== 0) {
        for (const [i, { points: a }] of res.entries()) {
            for (const [j, { pos: { x: x1, y: y1 }, isDuplicated }] of a.entries()) {
                if (isDuplicated) continue;
                for (const [k, { points: b }] of res.entries()) {
                    for (const [l, { pos: { x: x2, y: y2 } }] of b.entries()) {
                        if ((i === k && j === l) || b[l].isDuplicated) continue;
                        b[l].isDuplicated = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) < threshold * threshold;
                    }
                }
            }
        }
    }
    res.push(...shapes.filter(v => v.isManipulateShape && v.isSelected));
    return res.map(v => ({ ...v, points: v.points.filter(v2 => !v2.isDuplicated) })) as ProcessedPoints[];
}