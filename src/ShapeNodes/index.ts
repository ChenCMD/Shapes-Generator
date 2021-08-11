import LZString from 'lz-string';
import { showNotification } from '../components/ShapesGenerator';
import { locale } from '../locales';
import { ExportObject } from '../types/ExportObject';
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
        return parsedExportObjects.map(v => new shapes[v.type](v.name, v.params));
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