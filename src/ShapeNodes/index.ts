import LZString from 'lz-string';
import { showNotification } from '../components/ShapesGenerator';
import { locale } from '../locales';
import { migrate } from '../schema';
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

const shapeConstructors: Record<ShapeType, ShapeConstructor> = {
    line: LineShape,
    circle: CircleShape,
    polygon: PolygonShape,
    'line-anchor': LineAnchorShape,
    'circle-anchor': CircleAnchorShape,
    'polygon-anchor': PolygonAnchorShape
};

export function getShape(id: string, type: ShapeType): Shape {
    return new shapeConstructors[type](id);
}

function uuidReplacer(uuid: UUID | undefined, uuidMap: Map<UUID, UUID>): UUID | undefined {
    if (!uuid) {
        return uuid;
    }
    if (uuidMap.has(uuid)) {
        return uuidMap.get(uuid)!;
    }
    const newUUID = generateUUID();
    uuidMap.set(uuid, newUUID);
    return newUUID;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function uuidFixer(data: unknown, uuidMap: Map<UUID, UUID>): any {
    if (Array.isArray(data)) {
        return data.map(v => uuidFixer(v, uuidMap));
    }
    if (((v: unknown): v is { [k: string]: unknown } => typeof v === 'object' && !!v)(data)) {
        const res: { [k: string]: unknown } = {};
        for (const k of Object.getOwnPropertyNames(data)) {
            res[k] = uuidFixer(data[k], uuidMap);
        }
        return res;
    }
    if (typeof data === 'string' && isUUID(data)) {
        return uuidReplacer(data, uuidMap);
    }
    return data;
}

const currentDataVersion = 3;

export function importShape(importKey: string): Shape[] {
    const [, encodedObject, version] = /^([A-Za-z0-9+\-$]+)(?:_(\d+))?$/.exec(importKey) ?? [undefined, undefined, undefined];
    if (!encodedObject) {
        showNotification('error', locale('error.invalid.import-key'));
        return [];
    }
    const decodedObjects = LZString.decompressFromEncodedURIComponent(encodedObject);
    if (!decodedObjects) {
        showNotification('error', locale('error.invalid.import-key'));
        return [];
    }
    try {
        const parsedObjects: ExportObject[] = uuidFixer(
            migrate(JSON.parse(decodedObjects), parseInt(version || '1'), currentDataVersion),
            new Map<UUID, UUID>()
        );
        return parsedObjects.map(
            v => new shapeConstructors[v.type](v.name, v.params as ParamValue<{ [k: string]: Param }>, v.uuid)
        );
    } catch (e) {
        console.error(e.stack);
        if (e instanceof SyntaxError) {
            showNotification('error', locale('error.invalid.import-key'));
        } else {
            showNotification('error', locale('error.import-unknown-problem'));
        }
        return [];
    }
}

export function generateExportKey(shapes: Shape[]): string {
    return `${LZString.compressToEncodedURIComponent(JSON.stringify(shapes.map(v => v.toExportObject())))}_${currentDataVersion}`;
}