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
    let latestPos: Point | undefined = undefined;
    return shapes
        .sort(({ point: a }, { point: b }) => {
            if (a.pos[0] < b.pos[0]) return 1;
            if (a.pos[0] > b.pos[0]) return -1;
            return b.pos[1] - a.pos[1];
        })
        .filter(({ point: { pos: p } }) => {
            if (!latestPos) {
                latestPos = p;
                return true;
            }
            const squaredDistance = (latestPos[0] - p[0]) * (latestPos[0] - p[0]) + (latestPos[1] - p[1]) * (latestPos[1] - p[1]);
            const isDuplicated = squaredDistance < threshold * threshold;
            if (!isDuplicated) latestPos = p;
            return !isDuplicated;
        });
}