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

export function importShape(importKey: string): Shape[] {
    const rawExportObjects = LZString.decompressFromEncodedURIComponent(importKey);
    if (!rawExportObjects) {
        showNotification('error', locale('error.invalid.import-key'));
        return [];
    }
    try {
        const parsedExportObjects: ExportObject[] = JSON.parse(rawExportObjects);
        const uuidMap = new Map<UUID, UUID>();
        const replaceUUID = (uuid: UUID | undefined) => {
            if (!uuid) return uuid;
            if (uuidMap.has(uuid)) return uuidMap.get(uuid);
            const newUUID = generateUUID();
            uuidMap.set(uuid, newUUID);
            return newUUID;
        };
        const walkParams = (obj: { [k: string]: unknown }) => {
            for (const k in obj) {
                const value = obj[k];
                if (typeof value === 'object' && value) walkParams(value as { [k: string]: unknown });
                if (typeof value === 'string' && isUUID(value)) obj[k] = replaceUUID(value);
            }
            return obj;
        };
        return parsedExportObjects.map(v => new shapes[v.type](v.name, walkParams(v.params) as ParamValue<{ [k: string]: Param }>, replaceUUID(v.uuid)));
    } catch (e) {
        if (e instanceof SyntaxError)
            showNotification('error', locale('error.invalid.import-key'));
        else
            showNotification('error', `${locale('error.import-unknown-problem')} ${e.toString()}`);
        return [];
    }
}

export function generateExportKey(exportObjects: ExportObject[]): string {
    return LZString.compressToEncodedURIComponent(JSON.stringify(exportObjects));
}