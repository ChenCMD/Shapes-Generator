import React, { useState } from 'react';
import { Stage, Layer, Rect, Circle } from 'react-konva';
import { Point } from '../types/Shape';
import Measure from 'react-measure';

interface PreviewerProps {
    shapePoints: Point[][]
    selectedIDs: string[]
}

const Previewer: React.FC<PreviewerProps> = ({ shapePoints, selectedIDs }) => {
    const [size, setSize] = useState<number>(100);

    const points: JSX.Element[] = shapePoints.map(shape =>
        shape.map(({ id, x, y }) => (
            <Circle
                x={x + size / 2} y={y + size / 2}
                radius={3}
                fill={selectedIDs.some(v => v.startsWith(id)) ? 'yellow' : 'white'}
                key={id}
            />
        ))
    ).flat();

    return (
        <div className="previewer-window rounded">
            <Measure bounds onResize={contentRect => setSize(contentRect.bounds?.width ?? 100)}>
                {({ measureRef }) => (
                    <div ref={measureRef}>
                        <Stage width={size} height={size - 7}>
                            <Layer>
                                <Rect x={5} y={5} width={size - 10} height={size - 17} fill="rgb(16, 16, 16)" />
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
