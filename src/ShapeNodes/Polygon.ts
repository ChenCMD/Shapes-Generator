import rfdc from 'rfdc';
import { AbstractShapeNode, ParameterMetaData } from '../types/AbstractNode';
import { createPoint, Point } from '../types/Point';
import { mod, toRadians } from '../utils/common';

type PolygonParams =
    | 'count'
    | 'center_x'
    | 'center_y'
    | 'radius'
    | 'start'
    | 'ellipse'
    | 'rotate'
    | 'corner'
    | 'jump'
    | 'vezier';

const defaultParams: Record<PolygonParams, string> = {
    count: '10',
    center_x: '0',
    center_y: '0',
    radius: '5',
    start: '0',
    ellipse: '100',
    rotate: '0',
    corner: '5',
    jump: '2',
    vezier: '0'
};

const paramMetaData: Record<PolygonParams, ParameterMetaData> = {
    center_x: { name: '中心点', description: '多角形の中心点' },
    center_y: { name: '中心点', description: '多角形の中心点' },
    count: { name: '生成数', description: 'いくつの点で生成するか' },
    radius: { name: '半径', description: '中心よりどれだけ離れた位置で円を作るか' },
    start: { name: '開始角', description: '多角形を始める角度' },
    ellipse: { name: '楕円', description: '楕円の歪みの強さ' },
    rotate: { name: '角度', description: '開始角には影響は与えません' },
    corner: { name: '角の数', description: '' },
    jump: { name: '飛ばす角の数', description: '角をいくつ先の角と紐づけていくか<br>2以上で星などの複雑な図形を生成できます' },
    vezier: { name: 'ベジェ補正値', description: '始点から見て+で右に, -で左に離れた位置を制御点にします' }
};

export class PolygonShape extends AbstractShapeNode<PolygonParams> {
    public constructor(id: string) {
        super(id, rfdc()(defaultParams), paramMetaData);
    }

    protected updatePointSet(params: Record<PolygonParams, number>): void {
        const points: Point[] = [];
        const addPoint = (x: number, y: number) => points.push(createPoint(this.uuid, x, y));

        const drawLine = (from: { x: number, y: number }, to: { x: number, y: number }) => {
            const distanceX = to.x - from.x;
            const distanceY = to.y - from.y;
            const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
            for (let i = 0; i < distance; i += distance / params.count)
                addPoint(from.x + distanceX * (i / distance), from.y + distanceY * (i / distance));
        };

        const corners: { x: number, y: number }[] = [];
        for (let theta = params.start; theta < 360 + params.start; theta += 360 / params.corner) {
            corners.push({
                x: params.center_x + Math.sin(toRadians(theta)) * params.radius,
                y: params.center_y + -Math.cos(toRadians(theta)) * params.radius
            });
        }
        for (const [i, corner] of corners.entries()) drawLine(corner, corners[mod(i + params.jump, corners.length)]);

        this.pointSet = points;
    }
}