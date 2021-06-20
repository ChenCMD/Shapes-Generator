import React, { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import ShapeListItem from './ShapeListItem';
import ShapeListMenu from './ShapeListMenu';
import styles from '../styles/ShapeList.module.scss';
import { Shape } from '../ShapeNodes';
import { mod } from '../utils/common';

interface ShapeListProps {
    shapes: Shape[]
    setShapes: (shapes: Shape[]) => void
    selectedShapes: Shape[],
    setSelectedShapes: (shapes: Shape[]) => void
}

const ShapeList: React.FC<ShapeListProps> = ({ shapes, setShapes, selectedShapes, setSelectedShapes }) => {
    const [focusItem, setFocusItem] = useState<number>(0);
    useEffect(() => document.getElementById(`shape-list-item-${focusItem}`)?.focus(), [focusItem]);
    useEffect(() => document.getElementById('scroll-bar')?.scrollTo(0, 2147483647), [shapes]);

    const items = shapes.map((shape, i) => {
        const onBlur = (e: { preventDefault: () => void }, newID: string) => {
            if (!shape.setName(newID)) return e.preventDefault();
            setSelectedShapes([...selectedShapes]);
            setShapes([...shapes]);
        };
        const onClick = (isPushCtrl: boolean) => {
            if (isPushCtrl) {
                if (selectedShapes.includes(shape))
                    setSelectedShapes(selectedShapes.filter(v => v !== shape));
                else
                    setSelectedShapes([...selectedShapes, shape]);
            } else {
                setSelectedShapes([shape]);
            }
        };
        const onDelete = () => {
            setSelectedShapes(selectedShapes.filter(v => !selectedShapes.includes(v)));
            setShapes(shapes.filter(v => !selectedShapes.includes(v)));
        };
        const onSelectMove = (to: -1 | 1) => {
            const shapeIdx = mod(shapes.indexOf(shape) + to, shapes.length);
            console.log(`shapeIdx: ${shapeIdx}`);
            setFocusItem(shapeIdx);
            setSelectedShapes(shapes.slice(shapeIdx, shapeIdx + 1));
        };

        return (
            <ShapeListItem
                index={i}
                key={shape.name}
                name={shape.name}
                selectedShapes={selectedShapes}
                onExitFocus={onBlur}
                onSelect={onClick}
                onDelete={onDelete}
                onSelectMove={onSelectMove}
            />
        );
    });

    return (
        <div className={`${styles['shape-list-window']} rounded`}>
            <ShapeListMenu setShapes={(shape: Shape) => setShapes([...shapes, shape])} />
            <div id="scroll-bar" className={`${styles['shape-list']} overflow-auto`}>
                <ListGroup>
                    {items}
                </ListGroup>
            </ div>
        </ div>
    );
};

export default ShapeList;
