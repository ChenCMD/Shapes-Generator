import rfdc from 'rfdc';
import { AbstractShapeNode } from '../types/AbstractShapeNode';
import { NormalParameter, ParamMetaData as LineParamMetaData, ParamValue as LineParamValue, ParamValue, PosParameter } from '../types/Parameter';
import { createIdentifiedPoint, IdentifiedPoint, Point } from '../types/Point';

export interface LineParams {
    count: NormalParameter
    from: PosParameter
    to: PosParameter
    vezier: NormalParameter
}

const paramMetaData: LineParamMetaData<LineParams> = {
    count: { name: '生成数', description: 'いくつの点で生成するか', unit: '個', validation: { min: 2 } },
    from: { type: 'pos', name: '始点', description: '線の始点', unit: '' },
    to: { type: 'pos', name: '終点X', description: '線の終点', unit: '' },
    vezier: { name: 'ベジェ補正値', description: '始点から見て+で右に, -で左に離れた位置を制御点にします' }
};

const defaultParams: LineParamValue<LineParams> = {
    count: 10,
    from: { x: 1, y: 1 },
    to: { x: -1, y: -1 },
    vezier: 0
};

export class LineShape extends AbstractShapeNode<LineParams, keyof LineParams> {
    public constructor(name: string) {
        super('line', paramMetaData, name, rfdc()(defaultParams));
    }

    protected generatePointSet(params: ParamValue<LineParams>): IdentifiedPoint[] {
        const points: IdentifiedPoint[] = [];
        const addPoint = (pos: Point) => points.push(createIdentifiedPoint(this.uuid, pos));
        const calcPoint = (fromPos: Point, toPos: Point, t: number): Point => [
            (1 - t) * fromPos[0] + t * toPos[0],
            (1 - t) * fromPos[1] + t * toPos[1]
        ];

        const vector = [params.to.x - params.from.x, params.to.y - params.from.y];
        const vecMagnitude = Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
        const normalizedVector = [vector[1] / vecMagnitude * params.vezier, -vector[0] / vecMagnitude * params.vezier];

        const controlPoint: Point = [(params.from.x + params.to.x) / 2 + normalizedVector[0], (params.from.y + params.to.y) / 2 + normalizedVector[1]];
        for (let i = 0; i < params.count; i++) {
            const t = i / (params.count - 1);
            addPoint(calcPoint(calcPoint([params.from.x, params.from.y], controlPoint, t), calcPoint(controlPoint, [params.to.x, params.to.y], t), t));
        }

        return points;
    }
}