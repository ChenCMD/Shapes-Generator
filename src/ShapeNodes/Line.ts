import rfdc from 'rfdc';
import { AbstractShapeNode, ParameterMetaData, Point } from '../types/AbstractNode';

type Args =
    | 'count'
    | 'from_x'
    | 'from_y'
    | 'to_x'
    | 'to_y'
    | 'vezier';

const defaultParams: Record<Args, string> = {
    count: '10',
    from_x: '0',
    from_y: '0',
    to_x: '0',
    to_y: '0',
    vezier: '0'
};

const paramMetaData: Record<Args, ParameterMetaData> = {
    from_x: { name: '始点', description: '線の始点' },
    from_y: { name: '始点', description: '線の始点' },
    to_x: { name: '終点', description: '線の終点' },
    to_y: { name: '終点', description: '線の終点' },
    count: { name: '生成数', description: 'いくつの点で生成するか' },
    vezier: { name: 'ベジェ補正値', description: '始点から見て+で右に, -で左に離れた位置を制御点にします' }
};

export class LineShape extends AbstractShapeNode<Args> {
    public constructor(name: string, nameSet: Set<string>) {
        super(name, rfdc()(defaultParams), paramMetaData, nameSet);
    }

    protected updatePointSet(params: Record<Args, number>): void {
        const points: Point[] = [];
        const addPoint = (x: number, y: number) => points.push({ id: `${this.name}-${x}-${y}`, x, y });

        const distanceX = params.to_x - params.from_x;
        const distanceY = params.to_y - params.from_y;
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
        for (let i = 0; i < distance; i += distance / params.count)
            addPoint(params.from_x + distanceX * (i / distance), params.from_y + distanceY * (i / distance));

        this.pointSet = points;
    }
}