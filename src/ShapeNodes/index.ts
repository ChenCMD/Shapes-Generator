import LZString from 'lz-string';
import { ExportObject } from '../types/ExportObject';
import { CircleShape } from './Circle';
import { LineShape } from './Line';
import { PolygonShape } from './Polygon';

export type ShapeType = 'line' | 'circle' | 'polygon';
export type Shape = LineShape | CircleShape | PolygonShape;
type ShapeConstructor = typeof LineShape | typeof CircleShape | typeof PolygonShape;

const shapes: Record<ShapeType, ShapeConstructor> = {
    line: LineShape,
    circle: CircleShape,
    polygon: PolygonShape
};

export function getShape(id: string, type: ShapeType): Shape {
    return new shapes[type](id);
}

export function importShape(importKey: string): Shape[] {
    const rawExportObjects = LZString.decompressFromEncodedURIComponent(importKey);
    if (!rawExportObjects) {
        console.error('import keyが不正です'); // TODO エラー表示作る
        return [];
    }
    try {
        const parsedExportObjects: ExportObject[] = JSON.parse(rawExportObjects);
        return parsedExportObjects.map(v => new shapes[v.type](v.name, v.params));
    } catch (e) {
        if (e instanceof SyntaxError)
            console.error('import keyが不正です'); // TODO エラー表示作る
        else
            console.error('importで想定しない問題が発生しました。', e); // TODO エラー表示作る
        return [];
    }
}