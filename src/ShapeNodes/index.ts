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