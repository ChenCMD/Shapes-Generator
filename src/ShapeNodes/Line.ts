import rfdc from 'rfdc';
import { AbstractShapeNode, ParameterMetaData, Point } from '../types/AbstractNode';

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
        const points: Point[] = [];
        const addPoint = (x: number, y: number) => {
            const id = this.getPointID();
            points.push({ id, x, y });
        };

        const distanceX = params.to_x - params.from_x;
        const distanceY = params.to_y - params.from_y;
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
        for (let i = 0; i < distance; i += distance / params.count)
            addPoint(params.from_x + distanceX * (i / distance), params.from_y + distanceY * (i / distance));

        this.pointSet = points;
    }
}