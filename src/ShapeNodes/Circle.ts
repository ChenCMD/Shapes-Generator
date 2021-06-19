import rfdc from 'rfdc';
import { AbstractShapeNode, ParameterMetaData, Point } from '../types/AbstractNode';
import { toRadians } from '../utils/common';

type CircleParams =
    | 'count'
    | 'center_x'
    | 'center_y'
    | 'radius'
    | 'startAngle'
    | 'endAngle'
    | 'ellipse'
    | 'rotate';

const defaultParams: Record<CircleParams, string> = {
    count: '12',
    center_x: '0',
    center_y: '0',
    radius: '5',
    startAngle: '0',
    endAngle: '360',
    ellipse: '100',
    rotate: '0'
};

const paramMetaData: Record<CircleParams, ParameterMetaData> = {
    center_x: { name: '中心点', description: '円の中心点' },
    center_y: { name: '中心点', description: '円の中心点' },
    count: { name: '生成数', description: 'いくつの点で生成するか' },
    radius: { name: '半径', description: '中心よりどれだけ離れた位置で円を作るか' },
    startAngle: { name: '開始角', description: '円弧の始まりの角度' },
    endAngle: { name: '終了角', description: '円弧の終わりの角度' },
    ellipse: { name: '楕円', description: '楕円の歪みの強さ' },
    rotate: { name: '角度', description: '開始/終了角には影響は与えません' }
};

export class CircleShape extends AbstractShapeNode<CircleParams> {
    public constructor(name: string, nameSet: Set<string>) {
        super(name, rfdc()(defaultParams), paramMetaData, nameSet);
    }

    protected updatePointSet(params: Record<CircleParams, number>): void {
        const points: Point[] = [];
        const addPoint = (x: number, y: number) => points.push({ id: `${this.name}-${x}-${y}`, x, y });

        if (params.startAngle < params.endAngle) {
            for (let theta = params.startAngle; theta < params.endAngle; theta += (params.endAngle - params.startAngle) / params.count) {
                const x = params.center_x + Math.sin(toRadians(theta)) * params.radius;
                const y = params.center_y + -Math.cos(toRadians(theta)) * params.radius;
                addPoint(x, y);
            }
        } else {
            for (let theta = params.startAngle; theta > params.endAngle; theta -= (params.startAngle - params.endAngle) / params.count) {
                const x = params.center_x + Math.sin(toRadians(theta)) * params.radius;
                const y = params.center_y + -Math.cos(toRadians(-theta)) * params.radius;
                addPoint(x, y);
            }
        }

        this.pointSet = points;
    }
}