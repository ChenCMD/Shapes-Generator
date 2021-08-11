import React, { useCallback, useState } from 'react';
import { locale } from '../locales';
import { ShapesDispatch } from '../reducers/shapesReducer';
import { getShape, ShapeType, shapeTypes } from '../ShapeNodes';
import styles from '../styles/ShapeListMenu.module.scss';

interface ShapeListMenuProps {
    shapesDispatch: ShapesDispatch
}

const ShapeListMenu = ({ shapesDispatch }: ShapeListMenuProps): JSX.Element => {
    const [shapePulldown, setShapePulldown] = useState<ShapeType>('line');
    const [addCount, setAddCount] = useState<{ [k in ShapeType]?: number }>({});

    const addShapes = useCallback(() => {
        const cnt = (addCount[shapePulldown] ??= 0) + 1;
        setAddCount({ ...addCount, [shapePulldown]: cnt });
        shapesDispatch({ type: 'add', shape: getShape(`${locale(`shape.${shapePulldown}`)} ${cnt}`, shapePulldown) });
    }, [addCount, shapePulldown, shapesDispatch]);

    const onChangeTargetShape = useCallback((e: { target: { value: string } }) => setShapePulldown(e.target.value as ShapeType), []);

    return (
        <div className={styles['menu']}>
            <select className={styles['pulldown']} value={shapePulldown} onChange={onChangeTargetShape}>
                {shapeTypes.map(v => (<option className={styles['option']} key={v} value={v}>{locale(`shape.${v}`)}</option>))}
            </select>
            <button className={styles['add']} onClick={addShapes} >+</button>
        </div>
    );
};

export default React.memo(ShapeListMenu);
