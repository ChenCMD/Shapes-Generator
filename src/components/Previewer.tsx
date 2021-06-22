import React, { useState } from 'react';
import { Stage, Layer, Rect, Circle, Line } from 'react-konva';
import Measure from 'react-measure';
import styles from '../styles/Previewer.module.scss';
import { Point } from '../types/Point';
import { greaterOr } from '../utils/common';

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
    const padding = size / 8;
    const posMultiple = greaterOr((size - padding * 2) / 2 / maxBounds, size / 8);
    const centerModifier = size / 2;
    const points = shapePoints.map(shape =>
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

    const grids: JSX.Element[] = [];
    if (posMultiple) {
        for (let i = 0; i * posMultiple < size / 2; i++) {
            const linePos = i * posMultiple;
            grids.push(<Line key={`x-${linePos}`} points={[0, linePos + centerModifier, size, linePos + centerModifier]} stroke="rbg(64, 64, 64)" strokeWidth={1.5} />);
            grids.push(<Line key={`y-${linePos}`} points={[linePos + centerModifier, 0, linePos + centerModifier, size]} stroke="rbg(64, 64, 64)" strokeWidth={1.5} />);
            if (i === 0) continue;
            grids.push(<Line key={`x-${-linePos}`} points={[0, -linePos + centerModifier, size, -linePos + centerModifier]} stroke="rbg(64, 64, 64)" strokeWidth={1.5} />);
            grids.push(<Line key={`y-${-linePos}`} points={[-linePos + centerModifier, 0, -linePos + centerModifier, size]} stroke="rbg(64, 64, 64)" strokeWidth={1.5} />);
        }
    }

    return (<>
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
        size: {size} | posMultiple: {posMultiple}
    </>
    );
};

export default Previewer;
