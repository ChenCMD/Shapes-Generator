import React, { useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { Shape } from '../types/Shape';
import ShapeListItem from './ShapeListItem';
import ShapeListMenu from './ShapeListMenu';
import styles from '../styles/ShapeList.module.scss';

interface ShapeListProps {
    shapes: Shape[]
    setShapes: (shapes: Shape[]) => void
    selectedShapes: Shape[],
    setSelectedShapes: (shapes: Shape[]) => void
}

const ShapeList: React.FC<ShapeListProps> = ({ shapes, setShapes, selectedShapes, setSelectedShapes }) => {
    useEffect(() => document.getElementById('scroll-bar')?.scrollTo(0, 2147483647), [shapes]);

    const onClick = (targetID: string, isPushCtrl: boolean) => {
        if (isPushCtrl && selectedShapes.some(v => v.id === targetID)) return setSelectedShapes(selectedShapes.filter(v => v.id !== targetID));

        const selected = shapes.filter(v => v.id === targetID);
        return setSelectedShapes(isPushCtrl ? [...selectedShapes, ...selected] : selected);
    };

    const onBlur = (targetID: string, newID: string) => {
        const changeID = (shape: Shape, id: string) => {
            console.log(`updated id: ${shape.id} => ${id}`);
            shape.id = id;
            return shape;
        };
        setSelectedShapes(selectedShapes.map(v => v.id === targetID ? changeID(v, newID) : v));
        setShapes(shapes.map(v => v.id === targetID ? changeID(v, newID) : v));
        return;
    };

    return (
        <div className={`${styles['shape-list-window']} rounded`}>
            <ShapeListMenu setShapes={(shape: Shape) => setShapes([...shapes, shape])} />
            <div id="scroll-bar" className={`${styles['shape-list']} overflow-auto`}>
                <ListGroup>
                    {shapes.map(shape => (
                        <ShapeListItem
                            key={shape.id} id={shape.id}
                            selectedShapes={selectedShapes}
                            onExitFocus={onBlur}
                            onSelect={onClick}
                        />
                    ))}
                </ListGroup>
            </ div>
        </ div>
    );
};

export default ShapeList;
