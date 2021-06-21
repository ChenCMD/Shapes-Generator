import React, { useState } from 'react';
import { Stage, Layer, Rect, Circle } from 'react-konva';
import Measure from 'react-measure';
import styles from '../styles/Previewer.module.scss';
import { Point } from '../types/Point';

interface PreviewerProps {
    shapePoints: { selected: boolean, points: Point[] }[]
}

const Previewer: React.FC<PreviewerProps> = ({ shapePoints }) => {
    const [size, setSize] = useState<number>(100);

    const maxBounds = Math.max(
        ...shapePoints
            .flatMap(v => v.points)
            .flatMap(v => [v.x, v.y])
            .map(Math.abs)
    );
    const padding = 24;
    const posMultiple = (size - padding * 2) / 2 / maxBounds;
    const centerModifier = size / 2;

    const points: JSX.Element[] = shapePoints.map(shape =>
        shape.points.map(({ x, y, id }) => (
            <Circle
                x={x * posMultiple + centerModifier}
                y={y * posMultiple + centerModifier}
                radius={4}
                fill='rgb(212, 212, 212)'
                strokeWidth={2}
                stroke={shape.selected ? '#007bff' : ''}
                key={id}
            />
        ))
    ).flat();

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
