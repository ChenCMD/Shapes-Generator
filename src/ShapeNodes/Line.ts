import { AbstractShapeNode } from '../types/AbstractShapeNode';
import { Manipulatable } from '../types/Manipulate';
import { BoolParameter, NormalParameter, Param, ParamMetaData, ParamValue, PosParameter, RangeParameter } from '../types/Parameter';
import { calcPoint, createIdentifiedPoint, IdentifiedPoint, Point } from '../types/Point';
import { UUID } from '../types/UUID';
import { mod, sampleDensely, spreadSamplesOver } from '../utils/math';

export interface LineParams {
    count: NormalParameter
    from: Manipulatable<PosParameter>
    to: Manipulatable<PosParameter>
    offset: RangeParameter
    bezier: NormalParameter
    isBezierEquallySpaced: BoolParameter
}

const paramMetaData: ParamMetaData<LineParams> = {
    count: { unit: 'unit.points', validation: { min: 1 } },
    from: { type: 'pos', unit: '', manipulatable: true },
    to: { type: 'pos', unit: '', manipulatable: true },
    offset: { type: 'range', unit: 'unit.per', min: 0, step: 1, max: 100 },
    bezier: {},
    isBezierEquallySpaced: { type: 'boolean' }
};

const defaultParams: ParamValue<LineParams> = {
    count: 10,
    from: { value: { x: 0, y: 0 } },
    to: { value: { x: 1, y: 1 } },
    offset: 0,
    bezier: 0,
    isBezierEquallySpaced: false
};

export class LineShape extends AbstractShapeNode<LineParams> {
    public constructor(name: string, params: ParamValue<{ [k: string]: Param }> = {}, uuid?: UUID) {
        super('line', defaultParams, paramMetaData, name, params, false, uuid);
    }

    protected generatePointSet(params: ParamValue<LineParams>): IdentifiedPoint[] {
        const points: IdentifiedPoint[] = [];
        const addPoint = (...pos: Point[]) => points.push(...pos.map(p => createIdentifiedPoint(this.uuid, p)));
        const calcBezierPoint = (t: number, ...p: Point[]): Point => {
            if (p.length === 1) {
                return p[0];
            }
            const l = calcBezierPoint(t, ...p.slice(0, p.length - 1));
            const r = calcBezierPoint(t, ...p.slice(1, p.length));
            return calcPoint(l, r, (a, b) => (1 - t) * a + t * b);
        };

        const pointPairs: [from: Point, to: Point][] = [];
        if (params.from.manipulate && params.to.manipulate) {
            for (const [i, from] of params.from.value.entries()) {
                pointPairs.push([from, params.to.value[i]]);
            }
        } else if (params.from.manipulate !== params.to.manipulate) {
            for (const from of params.from.manipulate ? params.from.value : [params.from.value]) {
                for (const to of params.to.manipulate ? params.to.value : [params.to.value]) {
                    pointPairs.push([from, to]);
                }
            }
        } else if (!params.from.manipulate && !params.to.manipulate) {
            pointPairs.push([params.from.value, params.to.value]);
        }

        for (const [from, to] of pointPairs) {
            const vector = calcPoint(from, to, (a, b) => b - a);
            const vecMagnitude = Math.sqrt(vector.x ** 2 + vector.y ** 2);
            const normalizedVector = {
                x: vecMagnitude && vector.y / vecMagnitude * params.bezier,
                y: vecMagnitude && -vector.x / vecMagnitude * params.bezier
            };

            const controlPoint = calcPoint(from, to, normalizedVector, (a, b, c) => (a + b) / 2 + c);
            if (params.isBezierEquallySpaced) {
                const samples = sampleDensely(t => calcBezierPoint(t, from, controlPoint, to));
                addPoint(...spreadSamplesOver(samples, params.count, false));
            } else {
                for (let i = 0; i < params.count; i++) {
                    const div = params.count - 1 || 1;
                    const t = i / div + 1 / div * (mod(params.offset, 100) / 100);
                    if (t > 1) {
                        continue;
                    }
                    addPoint(calcBezierPoint(t, from, controlPoint, to));
                }
            }
        }
        return points;
    }

    public clone(): LineShape {
        return new LineShape(`${this.name}-copy`, this.getParams());
    }
}