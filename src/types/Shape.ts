import rfdc from 'rfdc';

export interface Point {
    id: string
    x: number
    y: number
}

export interface Pos {
    x: string
    y: string
}

interface ShapeBase {
    id: string
    type: string
    arguments: { [key: string]: string | Pos | undefined }
    pointSet: Point[]
}

interface LineShape extends ShapeBase {
    type: 'line'
    arguments: {
        count: string
        from: Pos
        to: Pos
        vezier_modifier: string
    }
}

interface CircleShape extends ShapeBase {
    type: 'circle'
    arguments: {
        count: string
        center: Pos
        radius: string
        startAngle: string
        endAngle: string
        ellipse: string
        rotate: string
    }
}

interface PolygonShape extends ShapeBase {
    type: 'polygon'
    arguments: {
        corner: string
        jump: string
        count: string
        center: Pos
        radius: string
        startAngle: string
        endAngle: string
        ellipse: string
        rotate: string
        vezier_modifier: string
    }
}

const defaultArgument: { line: LineShape['arguments']; circle: CircleShape['arguments']; polygon: PolygonShape['arguments']; } = {
    line: {
        count: '10',
        from: { x: '0', y: '0' },
        to: { x: '0', y: '0' },
        vezier_modifier: '0'
    },
    circle: {
        count: '12',
        center: { x: '0', y: '0' },
        radius: '5',
        startAngle: '0',
        endAngle: '359',
        ellipse: '100',
        rotate: '0'
    },
    polygon: {
        corner: '5',
        jump: '2',
        count: '5',
        center: { x: '0', y: '0' },
        radius: '5',
        startAngle: '0',
        endAngle: '359',
        ellipse: '100',
        rotate: '0',
        vezier_modifier: '0'
    }
};

export type ShapeType = keyof typeof defaultArgument;

export type Shape = (LineShape | CircleShape | PolygonShape);

export function getShape<T extends ShapeType>(id: string, type: T): Shape {
    return {
        id,
        type,
        arguments: rfdc()(defaultArgument[type]),
        pointSet: []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
}

export function getParam(shape: Shape & { arguments: { [key: string]: string | Pos } }, arg: string): string | Pos {
    return shape.arguments[arg] ?? '';
}

export function changeParam(shape: Shape & { arguments: { [key: string]: string | Pos } }, newParam: string | Pos, arg: string): Shape {
    shape.arguments[arg] = newParam;
    return shape;
}

interface MetaData {
    name: string
    description: string
}

const argumentMetaData: { [key in ShapeType]: { [key: string]: MetaData | undefined } } = {
    line: {
        from: { name: '始点', description: '線の始点' },
        to: { name: '終点', description: '線の終点' },
        count: { name: '生成数', description: 'いくつの点で生成するか' },
        vezier_modifier: { name: 'ベジェ補正値', description: '始点から見て+で右に, -で左に離れた位置を制御点にします' }
    },
    circle: {
        center: { name: '中心点', description: '円の中心点' },
        count: { name: '生成数', description: 'いくつの点で生成するか' },
        radius: { name: '半径', description: '中心よりどれだけ離れた位置で円を作るか' },
        startAngle: { name: '開始角', description: '円弧の始まりの角度' },
        endAngle: { name: '終了角', description: '円弧の終わりの角度' },
        ellipse: { name: '楕円', description: '楕円の歪みの強さ' },
        rotate: { name: '角度', description: '開始/終了角には影響は与えません' }
    },
    polygon: {
        center: { name: '中心点', description: '円の中心点' },
        count: { name: '生成数', description: 'いくつの点で生成するか' },
        radius: { name: '半径', description: '中心よりどれだけ離れた位置で円を作るか' },
        startAngle: { name: '開始角', description: '円弧の始まりの角度' },
        endAngle: { name: '終了角', description: '円弧の終わりの角度' },
        ellipse: { name: '楕円', description: '楕円の歪みの強さ' },
        rotate: { name: '角度', description: '開始/終了角には影響は与えません' },
        corner: { name: '角の数', description: '' },
        jump: { name: '飛ばす角の数', description: '角をいくつ先の角と紐づけていくか<br>2以上で星などの複雑な図形を生成できます' },
        vezier_modifier: { name: 'ベジェ補正値', description: '始点から見て+で右に, -で左に離れた位置を制御点にします' }
    }
};

export function getArgumentMetaData(type: ShapeType, arg: string): MetaData {
    return argumentMetaData[type][arg] ?? { name: '', description: '' };
}