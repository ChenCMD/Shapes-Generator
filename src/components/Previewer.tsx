import React, { useState } from 'react';
import { Stage, Layer, Rect, Circle } from 'react-konva';
import { Point } from '../types/Shape';
import Measure from 'react-measure';
import styles from '../styles/Previewer.module.scss';

interface PreviewerProps {
    shapePoints: Point[][]
    selectedIDs: string[]
}

const Previewer: React.FC<PreviewerProps> = ({ shapePoints, selectedIDs }) => {
    const [size, setSize] = useState<number>(100);

    const points: JSX.Element[] = shapePoints.map(shape =>
        shape.map(({ id, x, y }) => (
            <Circle
                x={x * 25 + size / 2} y={y * 25 + size / 2}
                radius={3}
                fill={selectedIDs.some(v => id.startsWith(v)) ? 'rgb(120, 120, 180)' : 'rgb(212, 212, 212)'}
                key={id}
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
