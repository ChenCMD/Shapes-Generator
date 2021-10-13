import { Shape } from '../ShapeNodes';
import { generateUUID, UUID } from './UUID';

export interface Point {
    x: number
    y: number
}

export type IdentifiedPoint = {
    id: `${string}-${UUID}`
    pos: Point
};

export interface ProcessedPoints {
    name: string
    isManipulateShape: boolean
    isSelected: boolean
    points: IdentifiedPoint[]
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
    return { id: `${parentID}-${generateUUID()}`, pos };
}

export function deleteDuplicatedPoints(shapes: Shape[], threshold: number): ProcessedPoints[] {
    const processedPoints = shapes
        .filter(v => !v.isManipulateShape)
        .sort((a, b) => a.isSelected === b.isSelected ? 0 : (a.isSelected ? -1 : 1));
    const points: (IdentifiedPoint & { parentIdx: number, isDuplicated?: boolean })[] = processedPoints
        .flatMap((v, parentIdx) => v.points.map(p => ({ ...p, parentIdx })));
    if (threshold !== 0) {
        for (const [i, { pos: { x: x1, y: y1 }, isDuplicated }] of points.entries()) {
            if (isDuplicated) continue;
            for (const [j, { pos: { x: x2, y: y2 } }] of points.entries()) {
                if (i === j || points[j].isDuplicated) continue;
                points[j].isDuplicated = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) < threshold * threshold;
            }
        }
    }
    const ans = points.reduce<ProcessedPoints[]>(
        (arr, v) => (arr[v.parentIdx].points.push(...v.isDuplicated ? [] : [{ id: v.id, pos: v.pos }]), arr),
        processedPoints.map(({ name, isSelected, isManipulateShape }) => ({ name, isSelected, isManipulateShape, points: [] }))
    );
    ans.push(...shapes.filter(v => v.isManipulateShape && v.isSelected));
    return ans;
}