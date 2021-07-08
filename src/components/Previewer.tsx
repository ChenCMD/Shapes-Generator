import React, { useState } from 'react';
import { Stage, Layer, Rect, Circle, Line } from 'react-konva';
import Measure from 'react-measure';
import styles from '../styles/Previewer.module.scss';
import { GridMode } from '../types/GridMode';
import { IdentifiedPoint } from '../types/Point';
import { mod } from '../utils/common';

interface PreviewerProps {
    shapes: { selected: boolean, point: IdentifiedPoint }[]
    gridMode: GridMode
}

const Previewer: React.FC<PreviewerProps> = ({ shapes, gridMode }) => {
    const [size, setSize] = useState<number>(100);

    const bottomMargin = 35;
    const padding = size / 6;
    const centerModifier = { x: size / 2, y: (size - bottomMargin) / 2 };
    const maxBounds = Math.max(...shapes.flatMap(v => v.point.pos).map(Math.abs));
    const posMultiple = Math.min((size - padding * 2) / 2 / maxBounds, size / 12);

    const points: JSX.Element[] = [], grids: JSX.Element[] = [];
    if (posMultiple && maxBounds < 250) {
        points.push(...shapes
            .sort((a, b) => {
                if (a.selected === b.selected) return 0;
                if (a.selected) return 1;
                if (b.selected) return -1;
                return 0;
            })
            .map(({ selected, point: { pos: [x, y], id } }) => (
                <Circle
                    x={x * posMultiple + centerModifier.x}
                    y={y * posMultiple + centerModifier.y}
                    radius={0.15 * posMultiple}
                    fill='rgb(212, 212, 212)'
                    strokeWidth={2}
                    stroke={selected ? '#007bff' : ''}
                    key={id}
                />
            ))
        );

        if (gridMode !== GridMode.off) {
            const drawGridLine = (offset: number, axis: 'x' | 'y' = 'x') => {
                let strokeColor = 'rgb(64, 64, 64)';
                if (offset === 0) strokeColor = 'rgb(96,96,96)';
                if (mod(offset, 1) === 0.5) strokeColor = 'rgb(32,32,32)';
                const p = [0, offset * posMultiple + centerModifier[axis], size, offset * posMultiple + centerModifier[axis]];
                grids.push(<Line
                    key={`${axis}-${offset * posMultiple}`} stroke={strokeColor} strokeWidth={1.25}
                    points={axis === 'y' ? p : [p[1], p[0], p[3], p[2]]}
                />);

                if (axis === 'x') {
                    drawGridLine(offset, 'y');
                    if (offset > 0) drawGridLine(-offset);
                }
            };
            for (let i = 1 / gridMode; i * posMultiple * 2 < size; i += 1 / gridMode) drawGridLine(i);
            drawGridLine(0);
        }
    }

    return (
        <div className={styles['previewer-window']}>
            <Measure bounds onResize={contentRect => setSize(contentRect.bounds?.width ?? 100)}>
                {({ measureRef }) => (
                    <div ref={measureRef}>
                        <Stage width={size} height={size - bottomMargin}>
                            <Layer>
                                <Rect
                                    x={padding} y={padding}
                                    width={size - padding * 2} height={size - padding * 2}
                                    fill="rgb(16, 16, 16)"
                                />
                                {grids}
                                {points}
                            </Layer>
                        </Stage>
                    </div>
                )}
            </Measure>
        </div>
    );
};

export default Previewer;
