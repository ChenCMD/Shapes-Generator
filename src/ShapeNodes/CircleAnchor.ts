import { AbstractShapeNode } from '../types/AbstractShapeNode';
import { Manipulatable, ManipulateShape, NormalParameter, Param, ParamMetaData, ParamValue, PosParameter, RangeParameter } from '../types/Parameter';
import { createIdentifiedPoint, IdentifiedPoint, Point } from '../types/Point';
import { UUID } from '../types/UUID';
import { rotateMatrix2D, toRadians } from '../utils/common';

export interface CircleAnchorParams extends ManipulateShape {
    count: NormalParameter
    center: Manipulatable<PosParameter>
    radius: NormalParameter
    start: RangeParameter
    ellipse: RangeParameter
    rotate: RangeParameter
}

const paramMetaData: ParamMetaData<CircleAnchorParams> = {
    count: { unit: 'unit.points', validation: { min: 1 } },
    center: { type: 'pos', unit: '', manipulatable: true },
    radius: { unit: 'unit.meter', validation: { min: 0.0001 } },
    start: { type: 'range', unit: 'unit.degree', min: 0, max: 360, step: 1 },
    ellipse: { type: 'range', unit: 'unit.per', min: 0, max: 100, step: 1 },
    rotate: { type: 'range', unit: 'unit.degree', min: 0, max: 360, step: 1 },
    target: { type: 'target' }
};

const defaultParams: ParamValue<CircleAnchorParams> = {
    count: 3,
    center: { value: { x: 0, y: 0 } },
    radius: 5,
    start: 0,
    ellipse: 100,
    rotate: 0,
    target: { target: '', arg: '' }
};

export class CircleAnchorShape extends AbstractShapeNode<CircleAnchorParams, keyof CircleAnchorParams> {
    public constructor(name: string, params: ParamValue<{ [k: string]: Param }> = {}, uuid?: UUID) {
        super('circle-anchor', defaultParams, paramMetaData, name, params, true, uuid);
    }

    protected generatePointSet(params: ParamValue<CircleAnchorParams>): IdentifiedPoint[] {
        const points: IdentifiedPoint[] = [];
        const addPoint = (pos: Point) => points.push(createIdentifiedPoint(this.uuid, pos));

        for (const center of params.center.manipulate ? params.center.value : [params.center.value]) {
            for (let i = 0; i < params.count; i++) {
                const theta = toRadians(360 / params.count * i + params.start);
                const p: Point = rotateMatrix2D([
                    center.x + Math.sin(theta) * params.radius,
                    center.y + -Math.cos(theta) * params.radius
                ], params.rotate);
                addPoint(rotateMatrix2D([p[0], p[1] * (params.ellipse / 100)], -params.rotate));
            }
        }

        return points;
    }

    public clone(): CircleAnchorShape {
        return new CircleAnchorShape(`${this.name}-copy`, this.getParams());
    }
}