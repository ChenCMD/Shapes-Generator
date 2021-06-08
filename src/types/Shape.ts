import rfdc from 'rfdc';

export interface Point {
    id: string
    x: number
    y: number
}

const argumentDefaults = {
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
        start: '0',
        ellipse: {
            modifier: '100',
            rotate: '0'
        }
    },
    polygon: {
        corner: '5',
        jump: '2',
        count: '5',
        center: { x: '0', y: '0' },
        radius: '5',
        start: '0',
        ellipse: {
            modifier: '100',
            rotate: '0'
        },
        vezier_modifier: '0'
    }
};

export type ShapeType = keyof typeof argumentDefaults;

export interface Shape<T extends ShapeType = ShapeType> {
    id: string
    type: T
    arguments: (typeof argumentDefaults)[T],
    pointSet: Point[]
}

export function getShape<T extends ShapeType>(id: string, type: T): Shape<T> {
    return {
        id,
        type,
        arguments: rfdc()(argumentDefaults[type]),
        pointSet: []
    };
}
