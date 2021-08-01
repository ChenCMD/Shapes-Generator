import React, { useCallback, useState } from 'react';
import { locale } from '../locales';
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
        shapesDispatch({ type: 'add', shape: getShape(`${locale(`shape.${shapePulldown}`)} ${cnt}`, shapePulldown) });
    }, [addCount, shapePulldown, shapesDispatch]);

    const onChangeTargetShape = useCallback((e: { target: { value: string } }) => setShapePulldown(e.target.value as ShapeType), []);

    return (
        <div className={styles['menu']}>
            <select className={styles['pulldown']} value={shapePulldown} onChange={onChangeTargetShape}>
                <option className={styles['option']} value="line">{locale('shape.line')}</option>
                <option className={styles['option']} value="circle">{locale('shape.circle')}</option>
                <option className={styles['option']} value="polygon">{locale('shape.polygon')}</option>
            </select>
            <button className={styles['add']} onClick={addShapes} >+</button>
        </div>
    );
};

export default React.memo(ShapeListMenu);
