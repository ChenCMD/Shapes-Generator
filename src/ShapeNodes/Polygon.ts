import rfdc from 'rfdc';
import { AbstractShapeNode, ParameterMetaData } from '../types/AbstractShapeNode';
import { createIdentifiedPoint, IdentifiedPoint, Point } from '../types/Point';
import { mod, rotateMatrix2D, toRadians } from '../utils/common';

const polygonParams = ['count', 'center_x', 'center_y', 'radius', 'start', 'ellipse', 'rotate', 'corner', 'jump', 'vezier'] as const;
type PolygonParams = typeof polygonParams[number];

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
    center_x: { name: '中心点X', description: '多角形の中心点' },
    center_y: { name: '中心点Y', description: '多角形の中心点' },
    count: { name: '生成数', description: 'いくつの点で生成するか' },
    radius: { name: '半径', description: '中心よりどれだけ離れた位置に角を作るか' },
    start: { name: '開始角', description: '多角形を始める角度' },
    ellipse: { name: '楕円', description: '楕円の歪みの強さ' },
    rotate: { name: '楕円角', description: '楕円の歪みを与える角度' },
    corner: { name: '角の数', description: '' },
    jump: { name: '紐づける角の遠さ', description: '角をいくつ先の角と紐づけていくか 2以上で星などの複雑な図形を生成できます' },
    vezier: { name: 'ベジェ補正値', description: '始点から見て+で右に, -で左に離れた位置を制御点にします' }
};

export class PolygonShape extends AbstractShapeNode<PolygonParams> {
    public constructor(id: string) {
        super('polygon', polygonParams, paramMetaData, id, rfdc()(defaultParams));
    }

    protected updatePointSet(params: Record<PolygonParams, number>): void {
        const points: IdentifiedPoint[] = [];
        const addPoint = (pos: Point) => points.push(createIdentifiedPoint(this.uuid, pos));

        const drawLine = (from: Point, to: Point) => {
            const calcPoint = (fromPos: Point, toPos: Point, t: number): Point => [
                (1 - t) * fromPos[0] + t * toPos[0],
                (1 - t) * fromPos[1] + t * toPos[1]
            ];
            const vector = [to[0] - from[0], to[1] - from[1]];
            const vecMagnitude = Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
            const normalizedVector = [vector[1] / vecMagnitude * params.vezier, -vector[0] / vecMagnitude * params.vezier];

            const controlPoint: Point = [(from[0] + to[0]) / 2 + normalizedVector[0], (from[1] + to[1]) / 2 + normalizedVector[1]];
            for (let i = 0; i < params.count; i++) {
                const t = i / (params.count);
                addPoint(calcPoint(calcPoint(from, controlPoint, t), calcPoint(controlPoint, to, t), t));
            }
        };

        const corners: Point[] = [];
        for (let theta = params.start; theta < 360 + params.start; theta += 360 / params.corner) {
            const p: Point = rotateMatrix2D([
                params.center_x + Math.sin(toRadians(theta)) * params.radius,
                params.center_y + -Math.cos(toRadians(theta)) * params.radius
            ], params.rotate);
            corners.push(rotateMatrix2D([p[0], p[1] * (params.ellipse / 100)], -params.rotate));
        }
        for (const [i, corner] of corners.entries()) drawLine(corner, corners[mod(i + params.jump, corners.length)]);

        this.pointSet = points;
    }
}