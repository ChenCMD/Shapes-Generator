import deepEqual from 'fast-deep-equal';
import React, { useCallback, useEffect } from 'react';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import { ShapesDispatch } from '../reducers/shapesReducer';
import { Shape } from '../ShapeNodes';
import styles from '../styles/ShapeList.module.scss';
import { IndexedPoint } from '../types/Point';
import { StateDispatcher } from '../types/StateDispatcher';
import ShapeListItem from './ShapeListItem';
import ShapeListMenu from './ShapeListMenu';

interface ShapeListProps {
    shapes: Pick<Shape, 'uuid' | 'name' | 'isSelected'>[]
    latestSelect: number[]
    shapesDispatch: ShapesDispatch
    setContextTarget: StateDispatcher<IndexedPoint | undefined>
}

const ShapeList = ({ shapes, latestSelect, shapesDispatch, setContextTarget }: ShapeListProps): JSX.Element => {
    useEffect(() => document.getElementById(`shape-list-item-${latestSelect[0]}`)?.focus(), [latestSelect]);
    useEffect(() => document.getElementById('scroll-bar')?.scrollTo(0, 2147483647), [shapes.length]);

    const onSelect = useCallback((index: number, isRetentionOld: boolean) => shapesDispatch({ type: 'select', index, isRetentionOld }), [shapesDispatch]);

    const onMoveSelect = useCallback((index: number, to: -1 | 1) => shapesDispatch({ type: 'move', index, to }), [shapesDispatch]);

    const onDuplicate = useCallback((index: number) => shapesDispatch({ type: 'duplicate', index }), [shapesDispatch]);

    const showContextMenu = useCallback((index, e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
        shapesDispatch({ type: 'select', index, isRetentionOld: e.ctrlKey });
        setContextTarget({ x: e.clientX, y: e.clientY, index });
    }, [setContextTarget, shapesDispatch]);

    const items = shapes.map(({ uuid: key, name, isSelected }, index) => (
        // eslint-disable-next-line react/jsx-key
        <ShapeListItem
            {...{
                index, key, name, isSelected, onSelect,
                onMoveSelect, onDuplicate, showContextMenu, shapesDispatch
            }}
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
