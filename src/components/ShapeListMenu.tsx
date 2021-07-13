import React, { useState, useCallback } from 'react';
import { ShapesDispatch } from '../reducers/shapesReducer';
import { getShape, ShapeType } from '../ShapeNodes';
import styles from '../styles/ShapeListMenu.module.scss';

interface ShapeListMenuProps {
    shapesDispatch: ShapesDispatch
}

const ShapeListMenu = ({ shapesDispatch }: ShapeListMenuProps): JSX.Element => {
    const [shapePulldown, setShapePulldown] = useState<ShapeType>('line');
    const [addCount, setAddCount] = useState<Record<ShapeType, number>>({
        line: 0,
        circle: 0,
        polygon: 0
    });

    const addShapes = useCallback(() => {
        const cnt = addCount[shapePulldown] + 1;
        setAddCount({ ...addCount, [shapePulldown]: cnt });
        shapesDispatch({ type: 'add', shape: getShape(`${shapePulldown} ${cnt}`, shapePulldown) });
    }, [addCount, shapePulldown, shapesDispatch]);

    const onChangeTargetShape = useCallback((e: { target: { value: string } }) => setShapePulldown(e.target.value as ShapeType), []);

    return (
        <div className={styles['shape-list-menu']}>
            <select className={styles['shape-list-menu-pulldown']} value={shapePulldown} onChange={onChangeTargetShape}>
                <option className={styles['shape-list-menu-pulldown-option']} value="line">line</option>
                <option className={styles['shape-list-menu-pulldown-option']} value="circle">circle</option>
                <option className={styles['shape-list-menu-pulldown-option']} value="polygon">polygon</option>
            </select>
            <button className={styles['shape-list-menu-add']} onClick={() => addShapes()} >+</button>
        </div>
    );
};

export default React.memo(ShapeListMenu);
