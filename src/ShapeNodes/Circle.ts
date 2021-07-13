import rfdc from 'rfdc';
import { AbstractShapeNode, ParameterMetaData } from '../types/AbstractShapeNode';
import { createIdentifiedPoint, IdentifiedPoint, Point } from '../types/Point';
import { rotateMatrix2D, toRadians } from '../utils/common';

const circleParams = ['count', 'center_x', 'center_y', 'radius', 'start', 'ellipse', 'rotate'] as const;
type CircleParams = typeof circleParams[number];

const defaultParams: Record<CircleParams, string> = {
    count: '20',
    center_x: '0',
    center_y: '0',
    radius: '5',
    start: '0',
    ellipse: '100',
    rotate: '0'
};

const paramMetaData: Record<CircleParams, ParameterMetaData> = {
    center_x: { name: '中心点X', description: '円の中心点' },
    center_y: { name: '中心点Y', description: '円の中心点' },
    count: { name: '生成数', description: 'いくつの点で生成するか' },
    radius: { name: '半径', description: '中心よりどれだけ離れた位置で円を作るか' },
    start: { name: '開始角', description: '円を始める角度' },
    ellipse: { name: '楕円', description: '楕円の歪みの強さ' },
    rotate: { name: '楕円角', description: '楕円の歪みを与える角度' }
};

export class CircleShape extends AbstractShapeNode<CircleParams> {
    public constructor(id: string) {
        super('circle', circleParams, paramMetaData, id, rfdc()(defaultParams));
    }

    protected updatePointSet(params: Record<CircleParams, number>): void {
        const points: IdentifiedPoint[] = [];
        const addPoint = (pos: Point) => points.push(createIdentifiedPoint(this.uuid, pos));

        for (let theta = params.start; theta < 360 + params.start; theta += 360 / params.count) {
            const p: Point = rotateMatrix2D([
                params.center_x + Math.sin(toRadians(theta)) * params.radius,
                params.center_y + -Math.cos(toRadians(theta)) * params.radius
            ], params.rotate);
            addPoint(rotateMatrix2D([p[0], p[1] * (params.ellipse / 100)], -params.rotate));
        }

        this.pointSet = points;
    }
}