import LZString from 'lz-string';
import { showNotification } from '../components/ShapesGenerator';
import { locale } from '../locales';
import { ExportObject } from '../types/ExportObject';
import { Param, ParamValue } from '../types/Parameter';
import { generateUUID, isUUID, UUID } from '../types/UUID';
import { CircleShape } from './Circle';
import { CircleAnchorShape } from './CircleAnchor';
import { LineShape } from './Line';
import { LineAnchorShape } from './LineAnchor';
import { PolygonShape } from './Polygon';
import { PolygonAnchorShape } from './PolygonAnchor';

export const shapeTypes = [
    'line',
    'circle',
    'polygon',
    'line-anchor',
    'circle-anchor',
    'polygon-anchor'
] as const;
export type ShapeType = typeof shapeTypes[number];
export type Shape = LineShape | CircleShape | PolygonShape | LineAnchorShape | CircleAnchorShape | PolygonAnchorShape;
type ShapeConstructor = typeof LineShape | typeof CircleShape | typeof PolygonShape | typeof LineAnchorShape | typeof CircleAnchorShape | typeof PolygonAnchorShape;

const shapes: Record<ShapeType, ShapeConstructor> = {
    line: LineShape,
    circle: CircleShape,
    polygon: PolygonShape,
    'line-anchor': LineAnchorShape,
    'circle-anchor': CircleAnchorShape,
    'polygon-anchor': PolygonAnchorShape
};

export function getShape(id: string, type: ShapeType): Shape {
    return new shapes[type](id);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dataFixer(data: unknown, fixer: (k: string, v: unknown) => [k: string, v: unknown]): any {
    if (Array.isArray(data)) return data.map(v => dataFixer(v, fixer));
    if (((v: unknown): v is { [k: string]: unknown } => typeof v === 'object' && !!v)(data)) {
        const res: { [k: string]: unknown } = {};
        for (const k of Object.getOwnPropertyNames(data)) {
            const [k2, v2] = fixer(k, data[k]);
            res[k2] = dataFixer(v2, fixer);
        }
        return res;
    }
    return data;
}

const keyFixMap: { [k: string]: string } = {
    vezier: 'bezier'
};

export function importShape(importKey: string): Shape[] {
    const rawExportObjects = LZString.decompressFromEncodedURIComponent(importKey);
    if (!rawExportObjects) {
        showNotification('error', locale('error.invalid.import-key'));
        return [];
    }
    const uuidMap = new Map<UUID, UUID>();
    const replaceUUID = (uuid: UUID | undefined) => {
        if (!uuid) return uuid;
        if (uuidMap.has(uuid)) return uuidMap.get(uuid);
        const newUUID = generateUUID();
        uuidMap.set(uuid, newUUID);
        return newUUID;
    };
    try {
        const parsedExportObjects: ExportObject[] = dataFixer(
            JSON.parse(rawExportObjects),
            (key, val) => [
                keyFixMap[key] ?? key,
                [
                    (v: unknown) => typeof v === 'string' && isUUID(v) && replaceUUID(v),
                    (v: unknown, k: string) => (k === 'center' || k === 'from' || k === 'to') && typeof v === 'object' && !!v && 'x' in v && 'y' in v && { value: v }
                ].map(f => f(val, key)).filter(v => v)[0] || val
            ]
        );
        return parsedExportObjects.map(v => new shapes[v.type](v.name, v.params as ParamValue<{ [k: string]: Param }>, v.uuid));
    } catch (e) {
        console.log(e.stack);
        if (e instanceof SyntaxError)
            showNotification('error', locale('error.invalid.import-key'));
        else
            showNotification('error', locale('error.import-unknown-problem'));
        return [];
    }
}

export function generateExportKey(exportObjects: ExportObject[]): string {
    return LZString.compressToEncodedURIComponent(JSON.stringify(exportObjects));
}