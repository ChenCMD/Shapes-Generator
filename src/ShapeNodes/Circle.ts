import { AbstractShapeNode } from '../types/AbstractShapeNode';
import { Manipulatable, NormalParameter, Param, ParamMetaData, ParamValue, PosParameter, RangeParameter } from '../types/Parameter';
import { createIdentifiedPoint, IdentifiedPoint, Point } from '../types/Point';
import { UUID } from '../types/UUID';
import { toRadians, rotateMatrix2D } from '../utils/math';

export interface CircleParams {
    count: NormalParameter
    center: Manipulatable<PosParameter>
    radius: NormalParameter
    start: RangeParameter
    ellipse: RangeParameter
    rotate: RangeParameter
}

const paramMetaData: ParamMetaData<CircleParams> = {
    count: { unit: 'unit.points', validation: { min: 1 } },
    center: { type: 'pos', unit: '', manipulatable: true },
    radius: { unit: 'unit.meter', validation: { min: 0.0001 } },
    start: { type: 'range', unit: 'unit.degree', min: 0, max: 360, step: 1 },
    ellipse: { type: 'range', unit: 'unit.per', min: 0, max: 100, step: 1 },
    rotate: { type: 'range', unit: 'unit.degree', min: 0, max: 360, step: 1 }
};

const defaultParams: ParamValue<CircleParams> = {
    count: 20,
    center: { value: { x: 0, y: 0 } },
    radius: 5,
    start: 0,
    ellipse: 100,
    rotate: 0
};

export class CircleShape extends AbstractShapeNode<CircleParams, keyof CircleParams> {
    public constructor(name: string, params: ParamValue<{ [k: string]: Param }> = {}, uuid?: UUID) {
        super('circle', defaultParams, paramMetaData, name, params, false, uuid);
    }

    protected generatePointSet(params: ParamValue<CircleParams>): IdentifiedPoint[] {
        const points: IdentifiedPoint[] = [];
        const addPoint = (pos: Point) => points.push(createIdentifiedPoint(this.uuid, pos));

        for (const center of params.center.manipulate ? params.center.value : [params.center.value]) {
            for (let i = 0; i < params.count; i++) {
                const theta = toRadians(360 / params.count * i + params.start);
                const p: Point = rotateMatrix2D([
                    Math.sin(theta) * params.radius,
                    -Math.cos(theta) * params.radius
                ], params.rotate);
                const [rotatedX, rotatedY] = rotateMatrix2D([p[0], p[1] * (params.ellipse / 100)], -params.rotate);
                addPoint([rotatedX + center.x, rotatedY + center.y]);
            }
        }

        return points;
    }

    public clone(): CircleShape {
        return new CircleShape(`${this.name}-copy`, this.getParams());
    }
}