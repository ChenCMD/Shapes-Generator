import React, { useState } from 'react';
import { getShape, Shape, ShapeType } from '../ShapeNodes';
import styles from '../styles/ShapeListMenu.module.scss';

interface ShapeListMenuProps {
    addShape: (shape: Shape) => void
}

const ShapeListMenu = ({ addShape }: ShapeListMenuProps): JSX.Element => {
    const [shapePulldown, setShapePulldown] = useState<ShapeType>('line');
    const [addCount, setAddCount] = useState<Record<ShapeType, number>>({
        line: 0,
        circle: 0,
        polygon: 0
    });

    const addShapes = () => {
        const cnt = addCount[shapePulldown] + 1;

        setAddCount({ ...addCount, [shapePulldown]: cnt });
        addShape(getShape(`${shapePulldown} ${cnt}`, shapePulldown));
    };

    const onChangeTargetShape = (e: React.ChangeEvent<HTMLSelectElement>) => setShapePulldown(e.target.value as ShapeType);

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

export default ShapeListMenu;
