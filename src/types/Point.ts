import uuid from 'uuidjs';

export type Point = [x: number, y: number];

export interface IdentifiedPoint {
    id: string
    pos: Point
}

export function createIdentifiedPoint(parentID: string, pos: Point): IdentifiedPoint {
    return { id: `${parentID}-${uuid.generate()}`, pos };
}

export function deleteDuplicatedPoints<T extends { point: IdentifiedPoint }>(shapes: T[], threshold: number): T[] {
    const res: (T & { isDuplicated?: boolean })[] = shapes;
    for (let i = 0; i < res.length; i++) {
        if (res[i].isDuplicated) continue;
        for (let j = 0; j < res.length; j++) {
            if (i === j || res[j].isDuplicated) continue;
            const [x1, y1] = res[i].point.pos;
            const [x2, y2] = res[j].point.pos;
            res[j].isDuplicated = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) < threshold * threshold;
        }
    }
    return res.filter(v => !v.isDuplicated);
}