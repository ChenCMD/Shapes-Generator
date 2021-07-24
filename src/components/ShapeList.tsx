import deepEqual from 'fast-deep-equal';
import React, { useCallback, useEffect, useState } from 'react';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import { ShapesDispatch } from '../reducers/shapesReducer';
import { Shape } from '../ShapeNodes';
import styles from '../styles/ShapeList.module.scss';
import { mod } from '../utils/common';
import ShapeListItem from './ShapeListItem';
import ShapeListMenu from './ShapeListMenu';

interface ShapeListProps {
    shapes: Pick<Shape, 'uuid' | 'name' | 'isSelected'>[]
    shapesLength: number
    shapesDispatch: ShapesDispatch
    setContextTarget: (context: { x: number, y: number, index: number }) => void
}

const ShapeList = ({ shapes, shapesLength, shapesDispatch, setContextTarget }: ShapeListProps): JSX.Element => {
    const [focusItem, setFocusItem] = useState<number>(0);
    useEffect(() => document.getElementById(`shape-list-item-${mod(focusItem, shapesLength)}`)?.focus(), [focusItem, shapesLength]);
    useEffect(() => document.getElementById('scroll-bar')?.scrollTo(0, 2147483647), [shapesLength]);

    const onSelect = useCallback((index: number, isRetentionOld: boolean) => {
        setFocusItem(index);
        shapesDispatch({ type: 'select', index, isRetentionOld });
    }, [shapesDispatch]);

    const onMoveSelect = useCallback((index: number, to: -1 | 1) => {
        setFocusItem(index + to);
        shapesDispatch({ type: 'move', index, to });
    }, [shapesDispatch]);

    const onDuplicate = useCallback((index: number) => {
        setFocusItem(index + 1);
        shapesDispatch({ type: 'duplicate', index });
    }, [shapesDispatch]);

    const showContextMenu = useCallback((index, e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
        setFocusItem(index);
        shapesDispatch({ type: 'select', index, isRetentionOld: e.ctrlKey });
        setContextTarget({ x: e.clientX, y: e.clientY, index });
    }, [setContextTarget, shapesDispatch]);

    const items = shapes.map((shape, i) => (
        <ShapeListItem
            index={i}
            key={shape.uuid}
            name={shape.name}
            isSelected={shape.isSelected}
            onSelect={onSelect}
            onMoveSelect={onMoveSelect}
            onDuplicate={onDuplicate}
            showContextMenu={showContextMenu}
            shapesDispatch={shapesDispatch}
        />
    ));

    return (
        <div className={styles['window']}>
            <ShapeListMenu shapesDispatch={shapesDispatch} />
            <div id="scroll-bar" className={styles['list']}>
                <ListGroup>
                    {items}
                </ListGroup>
            </ div>
        </ div>
    );
};

export default React.memo(ShapeList, deepEqual);
