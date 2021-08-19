import { AbstractShapeNode } from '../types/AbstractShapeNode';
import { Manipulatable } from '../types/Manipulate';
import { BoolParameter, NormalParameter, Param, ParamMetaData, ParamValue, PosParameter, RangeParameter } from '../types/Parameter';
import { calcPoint, createIdentifiedPoint, IdentifiedPoint, Point } from '../types/Point';
import { UUID } from '../types/UUID';
import { toRadians, rotateMatrix2D, sampleDensely, spreadSamplesOver } from '../utils/math';

export interface CircleParams {
    count: NormalParameter
    center: Manipulatable<PosParameter>
    radius: NormalParameter
    start: RangeParameter
    ellipse: RangeParameter
    rotate: RangeParameter
    isBezierEquallySpaced: BoolParameter
}

const paramMetaData: ParamMetaData<CircleParams> = {
    count: { unit: 'unit.points', validation: { min: 1 } },
    center: { type: 'pos', unit: '', manipulatable: true },
    radius: { unit: 'unit.meter', validation: { min: 0.0001 } },
    start: { type: 'range', unit: 'unit.degree', min: 0, max: 360, step: 1 },
    ellipse: { type: 'range', unit: 'unit.per', min: 0, max: 100, step: 1 },
    rotate: { type: 'range', unit: 'unit.degree', min: 0, max: 360, step: 1 },
    isBezierEquallySpaced: { type: 'boolean' }
};

const defaultParams: ParamValue<CircleParams> = {
    count: 20,
    center: { value: { x: 0, y: 0 } },
    radius: 5,
    start: 0,
    ellipse: 100,
    rotate: 0,
    isBezierEquallySpaced: false
};

export class CircleShape extends AbstractShapeNode<CircleParams> {
    public constructor(name: string, params: ParamValue<{ [k: string]: Param }> = {}, uuid?: UUID) {
        super('circle', defaultParams, paramMetaData, name, params, false, uuid);
    }

    protected generatePointSet(params: ParamValue<CircleParams>): IdentifiedPoint[] {
        const points: IdentifiedPoint[] = [];
        const addPoint = (...pos: Point[]) => points.push(...pos.map(p => createIdentifiedPoint(this.uuid, p)));

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
            if (params.isBezierEquallySpaced) {
                const samples = [
                    ...sampleDensely(t => pointAt(t / 2)).map(v => (v.t / 0.5, v)),
                    ...sampleDensely(t => pointAt(t / 2 + 0.5)).map(v => (v.t / 0.5 + 0.5, v))
                ];
                console.log(samples);
                addPoint(...spreadSamplesOver(samples, params.count, true));
            } else {
                for (let i = 0; i < params.count; i++)
                    addPoint(pointAt(i / params.count));
            }
        }

        return points;
    }

    public clone(): CircleShape {
        return new CircleShape(`${this.name}-copy`, this.getParams());
    }
}