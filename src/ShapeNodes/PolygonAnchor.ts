import { AbstractShapeNode } from '../types/AbstractShapeNode';
import { BoolParameter, NormalParameter, Param, ParamMetaData, ParamValue } from '../types/Parameter';
import { calcPoint, createIdentifiedPoint, IdentifiedPoint, Point } from '../types/Point';
import { UUID } from '../types/UUID';
import { toRadians, rotateMatrix2D, mod, sampleDensely, spreadSamplesOver } from '../utils/math';
import { CircleAnchorParams } from './CircleAnchor';

export interface PolygonAnchorParams extends CircleAnchorParams {
    corner: NormalParameter
    jump: NormalParameter
    bezier: NormalParameter
    isEllipseEquallySpaced: BoolParameter
    isBezierEquallySpaced: BoolParameter
}

const paramMetaData: ParamMetaData<PolygonAnchorParams> = {
    count: { unit: 'unit.points', validation: { min: 1 } },
    center: { type: 'pos', unit: '', manipulatable: true },
    radius: { unit: 'unit.meter', validation: { min: 0.0001 } },
    start: { type: 'range', unit: 'unit.degree', min: 0, max: 360, step: 1 },
    ellipse: { type: 'range', unit: 'unit.per', min: 0, max: 100, step: 1 },
    rotate: { type: 'range', unit: 'unit.degree', min: 0, max: 360, step: 1 },
    corner: { validation: { min: 1 } },
    jump: {},
    bezier: {},
    target: { type: 'target' },
    isEllipseEquallySpaced: { type: 'boolean' },
    isBezierEquallySpaced: { type: 'boolean' }
};

const defaultParams: ParamValue<PolygonAnchorParams> = {
    count: 5,
    center: { value: { x: 0, y: 0 } },
    radius: 5,
    start: 0,
    ellipse: 100,
    rotate: 0,
    corner: 5,
    jump: 1,
    bezier: 0,
    target: { arg: '', target: '' },
    isEllipseEquallySpaced: false,
    isBezierEquallySpaced: false
};

export class PolygonAnchorShape extends AbstractShapeNode<PolygonAnchorParams> {
    public constructor(name: string, params: ParamValue<{ [k: string]: Param }> = {}, uuid?: UUID) {
        super('polygon-anchor', defaultParams, paramMetaData, name, params, true, uuid);
    }

    protected generatePointSet(params: ParamValue<PolygonAnchorParams>): IdentifiedPoint[] {
        const points: IdentifiedPoint[] = [];
        const addPoint = (...pos: Point[]) => points.push(...pos.map(p => createIdentifiedPoint(this.uuid, p)));

        const drawLine = (from: Point, to: Point) => {
            const calcBezierPoint = (t: number, ...p: Point[]): Point => {
                if (p.length === 1) return p[0];
                const l = calcBezierPoint(t, ...p.slice(0, p.length - 1));
                const r = calcBezierPoint(t, ...p.slice(1, p.length));
                return calcPoint(l, r, (a, b) => (1 - t) * a + t * b);
            };
            const vector = calcPoint(from, to, (a, b) => b - a);
            const vecMagnitude = Math.sqrt(vector.x ** 2 + vector.y ** 2);
            const normalizedVector = {
                x: vecMagnitude && vector.y / vecMagnitude * params.bezier,
                y: vecMagnitude && -vector.x / vecMagnitude * params.bezier
            };

            const controlPoint = calcPoint(from, to, normalizedVector, (a, b, c) => (a + b) / 2 + c);
            if (params.isBezierEquallySpaced) {
                const samples = sampleDensely(t => calcBezierPoint(t, from, controlPoint, to));
                addPoint(...spreadSamplesOver(samples, params.count, true));
            } else {
                for (let i = 0; i < params.count; i++) {
                    const t = i / params.count;
                    addPoint(calcBezierPoint(t, from, controlPoint, to));
                }
            }
        };

        for (const center of params.center.manipulate ? params.center.value : [params.center.value]) {
            const pointAt = (t: number) => {
                const theta = toRadians(360 / params.count * (params.count * t) + params.start);
                const p = rotateMatrix2D({
                    x: Math.sin(theta) * params.radius,
                    y: -Math.cos(theta) * params.radius
                }, params.rotate);
                const rotatedPoint = rotateMatrix2D({
                    x: p.x,
                    y: p.y * (params.ellipse / 100)
                }, -params.rotate);
                return calcPoint(rotatedPoint, center, (a, b) => a + b);
            };
            const corners: Point[] = [];
            if (params.isEllipseEquallySpaced) {
                const samples = [
                    ...sampleDensely(t => pointAt(t / 2)).map(v => (v.t / 0.5, v)),
                    ...sampleDensely(t => pointAt(t / 2 + 0.5)).map(v => (v.t / 0.5 + 0.5, v))
                ];
                corners.push(...spreadSamplesOver(samples, params.corner, true));
            } else {
                for (let i = 0; i < params.corner; i++)
                    corners.push(pointAt(i / params.corner));
            }
            for (const [i, corner] of corners.entries()) drawLine(corner, corners[mod(i + params.jump, corners.length)]);
        }
        return points;
    }

    public clone(): PolygonAnchorShape {
        return new PolygonAnchorShape(`${this.name}-copy`, this.getParams());
    }
}