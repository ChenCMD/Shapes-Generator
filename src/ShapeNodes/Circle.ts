import rfdc from 'rfdc';
import { AbstractShapeNode } from '../types/AbstractShapeNode';
import { NormalParameter, Param, ParamMetaData, ParamValue, PosParameter, RangeParameter } from '../types/Parameter';
import { createIdentifiedPoint, IdentifiedPoint, Point } from '../types/Point';
import { rotateMatrix2D, toRadians } from '../utils/common';

export interface CircleParams {
    count: NormalParameter
    center: PosParameter
    radius: NormalParameter
    start: RangeParameter
    ellipse: RangeParameter
    rotate: RangeParameter
}

const paramMetaData: ParamMetaData<CircleParams> = {
    count: { name: '生成数', description: 'いくつの点で生成するか', unit: '個', validation: { min: 1 } },
    center: { type: 'pos', name: '中心点', description: '円の中心点', unit: '' },
    radius: { name: '半径', description: '中心よりどれだけ離れた位置で円を作るか', unit: 'm', validation: { min: 0.0001 } },
    start: { type: 'range', name: '開始角', description: '円を始める角度', unit: '°', min: 0, max: 360, step: 1 },
    ellipse: { type: 'range', name: '楕円補正値', description: '楕円の歪みの強さ', unit: '%', min: 0, max: 100, step: 1 },
    rotate: { type: 'range', name: '楕円角', description: '楕円の歪みを与える角度', unit: '°', min: 0, max: 360, step: 1 }
};

const defaultParams: ParamValue<CircleParams> = {
    count: 20,
    center: { x: 0, y: 0 },
    radius: 5,
    start: 0,
    ellipse: 100,
    rotate: 0
};

export class CircleShape extends AbstractShapeNode<CircleParams, keyof CircleParams> {
    public constructor(name: string, params: ParamValue<{ [k: string]: Param }> = rfdc()(defaultParams)) {
        super('circle', paramMetaData, name, params as ParamValue<CircleParams>);
    }

    protected generatePointSet(params: ParamValue<CircleParams>): IdentifiedPoint[] {
        const points: IdentifiedPoint[] = [];
        const addPoint = (pos: Point) => points.push(createIdentifiedPoint(this.uuid, pos));

        for (let i = 0; i < params.count; i++) {
            const theta = toRadians(360 / params.count * i + params.start);
            const p: Point = rotateMatrix2D([
                params.center.x + Math.sin(theta) * params.radius,
                params.center.y + -Math.cos(theta) * params.radius
            ], params.rotate);
            addPoint(rotateMatrix2D([p[0], p[1] * (params.ellipse / 100)], -params.rotate));
        }

        return points;
    }

    public clone(): CircleShape {
        return new CircleShape(`${this.name}-copy`, rfdc()(this.params));
    }
}