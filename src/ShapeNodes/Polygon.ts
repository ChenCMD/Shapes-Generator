import rfdc from 'rfdc';
import { AbstractShapeNode, ParameterMetaData, Point } from '../types/AbstractNode';

type PolygonParams =
    | 'center_x'
    | 'center_y'
    | 'count'
    | 'radius'
    | 'startAngle'
    | 'endAngle'
    | 'ellipse'
    | 'rotate'
    | 'corner'
    | 'jump'
    | 'vezier';

const defaultParams: Record<PolygonParams, string> = {
    corner: '5',
    jump: '2',
    count: '5',
    center_x: '0',
    center_y: '0',
    radius: '5',
    startAngle: '0',
    endAngle: '360',
    ellipse: '100',
    rotate: '0',
    vezier: '0'
};

const paramMetaData: Record<PolygonParams, ParameterMetaData> = {
    center_x: { name: '中心点', description: '円の中心点' },
    center_y: { name: '中心点', description: '円の中心点' },
    count: { name: '生成数', description: 'いくつの点で生成するか' },
    radius: { name: '半径', description: '中心よりどれだけ離れた位置で円を作るか' },
    startAngle: { name: '開始角', description: '円弧の始まりの角度' },
    endAngle: { name: '終了角', description: '円弧の終わりの角度' },
    ellipse: { name: '楕円', description: '楕円の歪みの強さ' },
    rotate: { name: '角度', description: '開始/終了角には影響は与えません' },
    corner: { name: '角の数', description: '' },
    jump: { name: '飛ばす角の数', description: '角をいくつ先の角と紐づけていくか<br>2以上で星などの複雑な図形を生成できます' },
    vezier: { name: 'ベジェ補正値', description: '始点から見て+で右に, -で左に離れた位置を制御点にします' }
};

export class PolygonShape extends AbstractShapeNode<PolygonParams> {
    public constructor(name: string, nameSet: Set<string>) {
        super(name, rfdc()(defaultParams), paramMetaData, nameSet);
    }

    protected updatePointSet(params: Record<PolygonParams, number>): void {
        const points: Point[] = [];
        const addPoint = (x: number, y: number) => points.push({ id: `${this.name}-${x}-${y}`, x, y });

        this.pointSet = points;
    }
}