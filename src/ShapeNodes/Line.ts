import rfdc from 'rfdc';
import { AbstractShapeNode } from '../types/AbstractShapeNode';
import { NormalParameter, Param, ParamMetaData, ParamValue, PosParameter, RangeParameter } from '../types/Parameter';
import { createIdentifiedPoint, IdentifiedPoint, Point } from '../types/Point';
import { mod } from '../utils/common';

export interface LineParams {
    count: NormalParameter
    from: PosParameter
    to: PosParameter
    offset: RangeParameter
    vezier: NormalParameter
}

const paramMetaData: ParamMetaData<LineParams> = {
    count: { unit: 'unit.points', validation: { min: 1 } },
    from: { type: 'pos', unit: '' },
    to: { type: 'pos', unit: '' },
    offset: { type: 'range', unit: 'unit.per', min: 0, step: 1, max: 100 },
    vezier: {}
};

const defaultParams: ParamValue<LineParams> = {
    count: 10,
    from: { x: 0, y: 0 },
    to: { x: 1, y: 1 },
    offset: 0,
    vezier: 0
};

export class LineShape extends AbstractShapeNode<LineParams, keyof LineParams> {
    public constructor(name: string, params: ParamValue<{ [k: string]: Param }> = {}) {
        super('line', defaultParams, paramMetaData, name, params);
    }

    protected generatePointSet(params: ParamValue<LineParams>): IdentifiedPoint[] {
        const points: IdentifiedPoint[] = [];
        const addPoint = (pos: Point) => points.push(createIdentifiedPoint(this.uuid, pos));
        const calcPoint = (t: number, ...p: Point[]): Point => {
            if (p.length === 1) return p[0];
            const l = calcPoint(t, ...p.slice(0, p.length - 1));
            const r = calcPoint(t, ...p.slice(1, p.length));
            return [(1 - t) * l[0] + t * r[0], (1 - t) * l[1] + t * r[1]];
        };

        const vector = [params.to.x - params.from.x, params.to.y - params.from.y];
        const vecMagnitude = Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
        const normalizedVector = vecMagnitude !== 0
            ? [vector[1] / vecMagnitude * params.vezier, -vector[0] / vecMagnitude * params.vezier]
            : [0, 0];

        const controlPoint: Point = [(params.from.x + params.to.x) / 2 + normalizedVector[0], (params.from.y + params.to.y) / 2 + normalizedVector[1]];
        for (let i = 0; i < params.count; i++) {
            const div = params.count - 1 || 1;
            const t = i / div + 1 / div * (mod(params.offset, 100) / 100);
            if (t > 1) continue;
            addPoint(calcPoint(t, [params.from.x, params.from.y], controlPoint, [params.to.x, params.to.y]));
        }

        return points;
    }

    public clone(): LineShape {
        return new LineShape(`${this.name}-copy`, rfdc()(this.params));
    }
}