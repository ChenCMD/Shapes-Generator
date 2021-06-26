import rfdc from 'rfdc';
import { AbstractShapeNode, ParameterMetaData } from '../types/AbstractNode';
import { createIdentifiedPoint, IdentifiedPoint, Point } from '../types/Point';
import { toRadians } from '../utils/common';

type CircleParams =
    | 'count'
    | 'center_x'
    | 'center_y'
    | 'radius'
    | 'start'
    | 'ellipse'
    | 'rotate';

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
    center_x: { name: '中心点', description: '円の中心点' },
    center_y: { name: '中心点', description: '円の中心点' },
    count: { name: '生成数', description: 'いくつの点で生成するか' },
    radius: { name: '半径', description: '中心よりどれだけ離れた位置で円を作るか' },
    start: { name: '開始角', description: '円を始める角度' },
    ellipse: { name: '楕円', description: '楕円の歪みの強さ' },
    rotate: { name: '角度', description: '開始角には影響は与えません' }
};

export class CircleShape extends AbstractShapeNode<CircleParams> {
    public constructor(id: string) {
        super(id, rfdc()(defaultParams), paramMetaData);
    }

    protected updatePointSet(params: Record<CircleParams, number>): void {
        const points: IdentifiedPoint[] = [];
        const addPoint = (pos: Point) => points.push(createIdentifiedPoint(this.uuid, pos));

        for (let theta = params.start; theta < 360 + params.start; theta += 360 / params.count) {
            addPoint([
                params.center_x + Math.sin(toRadians(theta)) * params.radius,
                params.center_y + -Math.cos(toRadians(theta)) * params.radius
            ]);
        }

        this.pointSet = points;
    }
}