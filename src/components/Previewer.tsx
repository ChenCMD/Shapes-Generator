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

    const points: JSX.Element[] = shapePoints.map(shape =>
        shape.points.map(point => (
            <Circle
                x={point.x * 25 + size / 2} y={point.y * 25 + size / 2}
                radius={4}
                fill='rgb(212, 212, 212)'
                strokeWidth={2}
                stroke={shape.selected ? '#007bff' : ''}
                key={point.id}
            />
        ))
    ).flat();

    return (
        <div className={`${styles['previewer-window']} rounded`}>
            <Measure bounds onResize={contentRect => setSize(contentRect.bounds?.width ?? 100)}>
                {({ measureRef }) => (
                    <div ref={measureRef}>
                        <Stage width={size} height={size - 32}>
                            <Layer>
                                <Rect x={5} y={5} width={size - 10} height={size - 42} fill="rgb(16, 16, 16)" />
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
