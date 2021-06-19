import React, { useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import ShapeListItem from './ShapeListItem';
import ShapeListMenu from './ShapeListMenu';
import styles from '../styles/ShapeList.module.scss';
import { Shape } from '../ShapeNodes';

interface ShapeListProps {
    shapes: Shape[]
    setShapes: (shapes: Shape[]) => void
    selectedShapes: Shape[],
    setSelectedShapes: (shapes: Shape[]) => void
}

const ShapeList: React.FC<ShapeListProps> = ({ shapes, setShapes, selectedShapes, setSelectedShapes }) => {
    useEffect(() => document.getElementById('scroll-bar')?.scrollTo(0, 2147483647), [shapes]);

    const items = shapes.map(shape => {
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

        return (
            <ShapeListItem
                key={shape.name} name={shape.name}
                selectedShapes={selectedShapes}
                onExitFocus={onBlur}
                onSelect={onClick}
                onDelete={onDelete}
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
