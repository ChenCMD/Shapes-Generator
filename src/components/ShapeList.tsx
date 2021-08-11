import deepEqual from 'fast-deep-equal';
import React, { useCallback, useEffect } from 'react';
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
    latestSelect: number[]
    shapesDispatch: ShapesDispatch
    setContextTarget: (context: { x: number, y: number, index: number }) => void
}

const ShapeList = ({ shapes, shapesLength, latestSelect, shapesDispatch, setContextTarget }: ShapeListProps): JSX.Element => {
    useEffect(() => document.getElementById(`shape-list-item-${mod(latestSelect[0], shapesLength)}`)?.focus(), [latestSelect, shapesLength]);
    useEffect(() => document.getElementById('scroll-bar')?.scrollTo(0, 2147483647), [shapesLength]);

    const onSelect = useCallback((index: number, isRetentionOld: boolean) => shapesDispatch({ type: 'select', index, isRetentionOld }), [shapesDispatch]);

    const onMoveSelect = useCallback((index: number, to: -1 | 1) => shapesDispatch({ type: 'move', index, to }), [shapesDispatch]);

    const onDuplicate = useCallback((index: number) => shapesDispatch({ type: 'duplicate', index }), [shapesDispatch]);

    const showContextMenu = useCallback((index, e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
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
