import React, { useCallback, useMemo, useState } from 'react';
import { Circle, Layer, Line, Rect, Stage } from 'react-konva';
import Measure from 'react-measure';
import styles from '../styles/Previewer.module.scss';
import { GridMode } from '../types/GridMode';
import { IdentifiedPoint } from '../types/Point';
import { mod } from '../utils/common';

interface PreviewerProps {
    shapes: { selected: boolean, point: IdentifiedPoint }[]
    gridMode: GridMode
}

const Previewer = ({ shapes, gridMode }: PreviewerProps): JSX.Element => {
    const [size, setSize] = useState<number>(100);
    const rawStyle = window.getComputedStyle(document.documentElement);

    const bottomMargin = 35;
    const padding = size / 6;
    const centerModifier = useMemo(() => ({ x: size / 2, y: (size - bottomMargin) / 2 }), [size]);
    const maxBounds = Math.max(...shapes.flatMap(v => v.point.pos).map(Math.abs));
    const posMultiple = Math.min((size - padding * 2) / 2 / maxBounds, size / 12);

    const points: JSX.Element[] = [];
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
    }

    const grids = useMemo(() => {
        if (!posMultiple || maxBounds >= 250 || gridMode === GridMode.off) return [];
        const ans: JSX.Element[] = [];
        const drawGridLine = (offset: number, axis: 'x' | 'y' = 'x') => {
            let strokeColor = rawStyle.getPropertyValue('--grid-block-color');
            if (offset === 0)
                strokeColor = rawStyle.getPropertyValue('--grid-center-color');
            if (mod(offset, 1) === 0.5)
                strokeColor = rawStyle.getPropertyValue('--grid-double-color');
            const p = [0, offset * posMultiple + centerModifier[axis], size, offset * posMultiple + centerModifier[axis]];
            ans.push(<Line
                key={`${axis}-${offset * posMultiple}`} stroke={strokeColor} strokeWidth={1.25}
                points={axis === 'y' ? p : [p[1], p[0], p[3], p[2]]}
            />);

            if (axis === 'x') {
                drawGridLine(offset, 'y');
                if (offset > 0)
                    drawGridLine(-offset);
            }
        };
        for (let i = 1 / gridMode; i * posMultiple * 2 < size; i += 1 / gridMode)
            drawGridLine(i);
        drawGridLine(0);

        return ans;
    }, [centerModifier, gridMode, maxBounds, posMultiple, rawStyle, size]);

    const onResize = useCallback(({ bounds }: { bounds?: { width?: number } }) => setSize(bounds?.width ?? 100), []);

    return (
        <div className={styles['previewer-window']}>
            <Measure bounds onResize={onResize}>
                {({ measureRef }) => (
                    <div ref={measureRef}>
                        <Stage width={size} height={size - bottomMargin}>
                            <Layer>
                                <Rect
                                    x={padding} y={padding}
                                    width={size - padding * 2} height={size - padding * 2}
                                    fill={rawStyle.getPropertyValue('--window-bg-color')}
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

export default React.memo(Previewer);
