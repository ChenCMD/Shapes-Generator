import rfdc from 'rfdc';
import { AbstractShapeNode, ParameterMetaData } from '../types/AbstractShapeNode';
import { createIdentifiedPoint, IdentifiedPoint, Point } from '../types/Point';

type LineParams =
    | 'count'
    | 'from_x'
    | 'from_y'
    | 'to_x'
    | 'to_y'
    | 'vezier';

const defaultParams: Record<LineParams, string> = {
    count: '10',
    from_x: '1',
    from_y: '0',
    to_x: '-1',
    to_y: '0',
    vezier: '0'
};

const paramMetaData: Record<LineParams, ParameterMetaData> = {
    from_x: { name: '始点', description: '線の始点' },
    from_y: { name: '始点', description: '線の始点' },
    to_x: { name: '終点', description: '線の終点' },
    to_y: { name: '終点', description: '線の終点' },
    count: { name: '生成数', description: 'いくつの点で生成するか' },
    vezier: { name: 'ベジェ補正値', description: '始点から見て+で右に, -で左に離れた位置を制御点にします' }
};

export class LineShape extends AbstractShapeNode<LineParams> {
    public constructor(id: string) {
        super(id, rfdc()(defaultParams), paramMetaData);
    }

    protected updatePointSet(params: Record<LineParams, number>): void {
        const points: IdentifiedPoint[] = [];
        const addPoint = (pos: Point) => points.push(createIdentifiedPoint(this.uuid, pos));

        for (let t = 0; t < 1; t += 1 / params.count)
            addPoint([(1 - t) * params.from_x + t * params.to_x, (1 - t) * params.from_y + t * params.to_y]);

        this.pointSet = points;
    }
}