import rfdc from 'rfdc';
import { AbstractShapeNode, ParameterMetaData } from '../types/AbstractShapeNode';
import { createIdentifiedPoint, IdentifiedPoint, Point } from '../types/Point';

const lineParams = ['count', 'from_x', 'from_y', 'to_x', 'to_y', 'vezier'] as const;
type LineParams = typeof lineParams[number];

const defaultParams: Record<LineParams, string> = {
    count: '10',
    from_x: '1',
    from_y: '0',
    to_x: '-1',
    to_y: '0',
    vezier: '0'
};

const paramMetaData: Record<LineParams, ParameterMetaData> = {
    from_x: { name: '始点X', description: '線の始点' },
    from_y: { name: '始点Y', description: '線の始点' },
    to_x: { name: '終点X', description: '線の終点' },
    to_y: { name: '終点Y', description: '線の終点' },
    count: { name: '生成数', description: 'いくつの点で生成するか' },
    vezier: { name: 'ベジェ補正値', description: '始点から見て+で右に, -で左に離れた位置を制御点にします' }
};

export class LineShape extends AbstractShapeNode<LineParams> {
    public constructor(id: string) {
        super('line', lineParams, paramMetaData, id, rfdc()(defaultParams));
    }

    protected updatePointSet(params: Record<LineParams, number>): void {
        const points: IdentifiedPoint[] = [];
        const addPoint = (pos: Point) => points.push(createIdentifiedPoint(this.uuid, pos));
        const calcPoint = (fromPos: Point, toPos: Point, t: number): Point => [
            (1 - t) * fromPos[0] + t * toPos[0],
            (1 - t) * fromPos[1] + t * toPos[1]
        ];

        const vector = [params.to_x - params.from_x, params.to_y - params.from_y];
        const vecMagnitude = Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
        const normalizedVector = [vector[1] / vecMagnitude * params.vezier, -vector[0] / vecMagnitude * params.vezier];

        const controlPoint: Point = [(params.from_x + params.to_x) / 2 + normalizedVector[0], (params.from_y + params.to_y) / 2 + normalizedVector[1]];
        for (let i = 0; i < params.count; i++) {
            const t = i / (params.count - 1);
            addPoint(calcPoint(calcPoint([params.from_x, params.from_y], controlPoint, t), calcPoint(controlPoint, [params.to_x, params.to_y], t), t));
        }

        this.pointSet = points;
    }
}