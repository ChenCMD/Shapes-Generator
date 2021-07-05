import React, { useState } from 'react';
import { Stage, Layer, Rect, Circle, Line } from 'react-konva';
import Measure from 'react-measure';
import styles from '../styles/Previewer.module.scss';
import { GridMode } from '../types/GridMode';
import { IdentifiedPoint } from '../types/Point';

interface PreviewerProps {
    shapePoints: { selected: boolean, points: IdentifiedPoint[] }[]
    gridMode: GridMode
}

const Previewer: React.FC<PreviewerProps> = ({ shapePoints, gridMode }) => {
    const [size, setSize] = useState<number>(100);
    const centerModifier = size / 2;

    const maxBounds = Math.max(
        ...shapePoints
            .flatMap(v => v.points)
            .flatMap(v => v.pos)
            .map(Math.abs)
    );
    const padding = size / 6;
    const posMultiple = Math.min((size - padding * 2) / 2 / maxBounds, size / 12);

    const points: JSX.Element[] = [], grids: JSX.Element[] = [];
    if (posMultiple && maxBounds < 250) {
        points.push(...shapePoints.sort((a, b) => {
            if (a.selected === b.selected) return 0;
            if (a.selected) return 1;
            if (b.selected) return -1;
            return 0;
        }).flatMap(shape =>
            shape.points.map(({ pos: [x, y], id }) => (
                <Circle
                    x={x * posMultiple + centerModifier}
                    y={y * posMultiple + centerModifier}
                    radius={0.15 * posMultiple}
                    fill='rgb(212, 212, 212)'
                    strokeWidth={2}
                    stroke={shape.selected ? '#007bff' : ''}
                    key={id}
                />
            ))
        ));

        if (gridMode !== GridMode.off) {
            const drawGridLine = (axis: 'x' | 'y', offset: number) =>
                grids.push(
                    <Line
                        key={`${axis}-${offset}`}
                        points={
                            axis === 'x'
                                ? [0, offset + centerModifier, size, offset + centerModifier]
                                : [offset + centerModifier, 0, offset + centerModifier, size]
                        }
                        stroke={offset === 0 ? 'rgb(96,96,96)' : 'rgb(48, 48, 48)'}
                        strokeWidth={1.5}
                    />
                );
            for (let i = gridMode === GridMode.center ? 0 : 0.5; i * posMultiple < size / 2; i++) {
                const linePos = i * posMultiple;
                drawGridLine('x', linePos);
                drawGridLine('y', linePos);
                if (linePos === -linePos) continue;
                drawGridLine('x', -linePos);
                drawGridLine('y', -linePos);
            }
        }
    }

    return (
        <div className={`${styles['previewer-window']} rounded`}>
            <Measure bounds onResize={contentRect => setSize(contentRect.bounds?.width ?? 100)}>
                {({ measureRef }) => (
                    <div ref={measureRef}>
                        <Stage width={size} height={size}>
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
