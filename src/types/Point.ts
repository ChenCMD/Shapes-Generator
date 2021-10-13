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
    type P = IdentifiedPoint & { parentIdx: number, isDuplicated?: boolean };
    type ChunkMap = Record<number, Record<number, P[]>>;

    const processedPoints = shapes
        .filter(v => !v.isManipulateShape)
        .sort((a, b) => a.isSelected === b.isSelected ? 0 : (a.isSelected ? -1 : 1));
    const points: P[] = processedPoints.flatMap((v, parentIdx) => v.points.map(p => ({ ...p, parentIdx })));
    const chunkMap = points.reduce<ChunkMap>((map, p) => {
        const x = Math.floor(p.pos.x);
        const y = Math.floor(p.pos.y);
        map[x] ??= {};
        map[x][y] ??= [];
        map[x][y].push(p);
        return map;
    }, {});

    if (threshold !== 0) {
        for (const { id, pos: { x: x1, y: y1 }, isDuplicated } of points) {
            if (isDuplicated) continue;
            const duplicatablePoints = [Math.floor(x1 - threshold), Math.floor(x1 + threshold)]
                .flatMap(x => [Math.floor(y1 - threshold), Math.floor(y1 + threshold)].flatMap(y => (chunkMap[x] ?? {})[y]))
                .filter(p => p && p.id !== id && !p.isDuplicated);
            for (const p of duplicatablePoints) {
                const { pos: { x: x2, y: y2 } } = p;
                p.isDuplicated = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) < threshold * threshold;
            }
        }
    }

    return [
        ...points.reduce<ProcessedPoints[]>(
            (arr, v) => (arr[v.parentIdx].points.push(...v.isDuplicated ? [] : [{ id: v.id, pos: v.pos }]), arr),
            processedPoints.map(({ name, isSelected, isManipulateShape }) => ({ name, isSelected, isManipulateShape, points: [] }))
        ),
        ...shapes.filter(v => v.isManipulateShape && v.isSelected)
    ];
}