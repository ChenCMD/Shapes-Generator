import React, { useCallback, useMemo, useState } from 'react';
import { Circle, Layer, Line, Stage } from 'react-konva';
import Measure from 'react-measure';
import styles from '../styles/Previewer.module.scss';
import { GridMode } from '../types/GridMode';
import { calcPoint, ProcessedPoints } from '../types/Point';

interface PreviewerProps {
    shapes: ProcessedPoints[]
    gridMode: GridMode
}

const Previewer = ({ shapes, gridMode }: PreviewerProps): JSX.Element => {
    const [size, setSize] = useState<{ x: number, y: number }>({ x: 100, y: 100 });
    const minSize = size.x < size.y ? 'x' : 'y';
    const rawStyle = window.getComputedStyle(document.documentElement);

    const padding = size[minSize] / 6;
    const centerCorrection = useMemo(() => calcPoint(size, p => p / 2), [size]);
    const maxBounds = Math.ceil(Math.max(...shapes.flatMap(v => v.points.flatMap(v2 => [v2.x, v2.y])).map(Math.abs)));
    const getMultiple = useCallback((axis: 'x' | 'y') => Math.min((size[axis] - padding * 2) / 2 / maxBounds, size[axis] / 12), [maxBounds, padding, size]);
    const posMultiple = getMultiple(minSize);

    const points: JSX.Element[] = [];
    if (posMultiple && maxBounds < 250) {
        points.push(...shapes
            .sort((a, b) => {
                if (a.isSelected === b.isSelected) {
                    return 0;
                }
                if (a.isSelected) {
                    return 1;
                }
                if (b.isSelected) {
                    return -1;
                }
                return 0;
            })
            .flatMap(({ isSelected, isManipulateShape, points: p }) => p.map(({ x, y, id }) => (
                <Circle
                    {...calcPoint({ x, y }, centerCorrection, (a, b) => a * posMultiple + b)}
                    radius={(isManipulateShape ? 0.1 : 0.15) * posMultiple}
                    fill={isManipulateShape ? 'rgb(212, 212, 0)' : 'rgb(212, 212, 212)'}
                    strokeWidth={2}
                    stroke={
                        isManipulateShape
                            ? 'rgb(212, 212, 0)'
                            : isSelected
                                ? 'rgb(0, 128, 255)'
                                : ''
                    }
                    key={id}
                />
            )))
        );
    }

    const grids = useMemo(() => {
        if (!posMultiple || maxBounds >= 250 || gridMode === GridMode.off) {
            return [];
        }
        const ans: JSX.Element[] = [];
        const drawGridLine = (offset: number, axis: 'x' | 'y', strokeColor: string, width = 1.25) => {
            const anchor = offset * posMultiple + centerCorrection[axis === 'x' ? 'y' : 'x'];
            const p = [0, anchor, size[axis], anchor];
            ans.push(<Line
                key={`${axis}-${offset}`} stroke={strokeColor} strokeWidth={width}
                points={axis === 'x' ? p : [p[1], p[0], p[3], p[2]]}
            />);

            if (offset > 0) {
                drawGridLine(-offset, axis, strokeColor, width);
            }
        };

        if (gridMode === GridMode.double) {
            for (let i = 0.5; i * getMultiple('x') / 2 < size.x; i++) {
                drawGridLine(i, 'x', rawStyle.getPropertyValue('--grid-double-color'));
            }
            for (let i = 0.5; i * getMultiple('y') / 2 < size.y; i++) {
                drawGridLine(i, 'y', rawStyle.getPropertyValue('--grid-double-color'));
            }
        }

        for (let i = 1; i * getMultiple('x') / 2 < size.x; i++) {
            drawGridLine(i, 'x', rawStyle.getPropertyValue('--grid-block-color'));
        }
        for (let i = 1; i * getMultiple('y') / 2 < size.y; i++) {
            drawGridLine(i, 'y', rawStyle.getPropertyValue('--grid-block-color'));
        }

        drawGridLine(0, 'x', rawStyle.getPropertyValue('--grid-center-color'), 1.5);
        drawGridLine(0, 'y', rawStyle.getPropertyValue('--grid-center-color'), 1.5);

        return ans;
    }, [centerCorrection, getMultiple, gridMode, maxBounds, posMultiple, rawStyle, size]);

    // yの-2はborder分、本来ならclientから取得できるのだけどうまくいかなかったので
    const onResize = useCallback(({ bounds }: { bounds?: { width?: number, height?: number } }) =>
        setSize({ x: bounds?.width ?? 0, y: (bounds?.height ?? 0) - 2 }), []);

    return (
        <Measure bounds onResize={onResize}>
            {({ measureRef }) => (
                <div className={styles['window']} ref={measureRef}>
                    <Stage width={size.x} height={size.y}>
                        <Layer>
                            {grids}
                            {points}
                        </Layer>
                    </Stage>
                </div>
            )}
        </Measure>
    );
};

export default React.memo(Previewer);
