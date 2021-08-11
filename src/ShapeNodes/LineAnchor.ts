import { AbstractShapeNode } from '../types/AbstractShapeNode';
import { Manipulatable, ManipulateShape, NormalParameter, Param, ParamMetaData, ParamValue, PosParameter, RangeParameter } from '../types/Parameter';
import { createIdentifiedPoint, IdentifiedPoint, Point } from '../types/Point';
import { mod } from '../utils/common';

export interface LineAnchorParams extends ManipulateShape {
    count: NormalParameter
    from: Manipulatable<PosParameter>
    to: Manipulatable<PosParameter>
    offset: RangeParameter
    vezier: NormalParameter
}

const paramMetaData: ParamMetaData<LineAnchorParams> = {
    count: { unit: 'unit.points', validation: { min: 1 } },
    from: { type: 'pos', unit: '', manipulatable: true },
    to: { type: 'pos', unit: '', manipulatable: true },
    offset: { type: 'range', unit: 'unit.per', min: 0, step: 1, max: 100 },
    vezier: {},
    target: { type: 'target' }
};

const defaultParams: ParamValue<LineAnchorParams> = {
    count: 5,
    from: { value: { x: 0, y: 0 } },
    to: { value: { x: 1, y: 1 } },
    offset: 0,
    vezier: 0,
    target: { target: '', arg: '' }
};

export class LineAnchorShape extends AbstractShapeNode<LineAnchorParams, keyof LineAnchorParams> {
    public constructor(name: string, params: ParamValue<{ [k: string]: Param }> = {}) {
        super('line-anchor', defaultParams, paramMetaData, name, params, true);
    }

    protected generatePointSet(params: ParamValue<LineAnchorParams>): IdentifiedPoint[] {
        const points: IdentifiedPoint[] = [];
        const addPoint = (pos: Point) => points.push(createIdentifiedPoint(this.uuid, pos));
        const calcPoint = (t: number, ...p: Point[]): Point => {
            if (p.length === 1) return p[0];
            const l = calcPoint(t, ...p.slice(0, p.length - 1));
            const r = calcPoint(t, ...p.slice(1, p.length));
            return [(1 - t) * l[0] + t * r[0], (1 - t) * l[1] + t * r[1]];
        };

        const pointPairs: [from: { x: number, y: number }, to: { x: number, y: number }][] = [];
        if (params.from.manipulate && params.to.manipulate && params.from.value.length === params.to.value.length) {
            for (const [i, from] of params.from.value.entries())
                pointPairs.push([from, params.to.value[i]]);
        } else {
            for (const from of params.from.manipulate ? params.from.value : [params.from.value]) {
                for (const to of params.to.manipulate ? params.to.value : [params.to.value])
                    pointPairs.push([from, to]);
            }
        }

        for (const [from, to] of pointPairs) {
            const vector = [to.x - from.x, to.y - from.y];
            const vecMagnitude = Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
            const normalizedVector = vecMagnitude !== 0
                ? [vector[1] / vecMagnitude * params.vezier, -vector[0] / vecMagnitude * params.vezier]
                : [0, 0];

            const controlPoint: Point = [(from.x + to.x) / 2 + normalizedVector[0], (from.y + to.y) / 2 + normalizedVector[1]];
            for (let i = 0; i < params.count; i++) {
                const div = params.count - 1 || 1;
                const t = i / div + 1 / div * (mod(params.offset, 100) / 100);
                if (t > 1) continue;
                addPoint(calcPoint(t, [from.x, from.y], controlPoint, [to.x, to.y]));
            }
        }
        return points;
    }

    public clone(): LineAnchorShape {
        return new LineAnchorShape(`${this.name}-copy`, this.getParams());
    }
}