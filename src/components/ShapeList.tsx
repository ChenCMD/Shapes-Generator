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

    const onClick = (targetID: string, isPushCtrl: boolean) => {
        if (isPushCtrl && selectedShapes.some(v => v.name === targetID)) return setSelectedShapes(selectedShapes.filter(v => v.name !== targetID));

        const selected = shapes.filter(v => v.name === targetID);
        return setSelectedShapes(isPushCtrl ? [...selectedShapes, ...selected] : selected);
    };

    const onBlur = (e: { preventDefault: () => void }, targetID: string, newID: string) => {
        if (!shapes.filter(v => v.name === targetID).every(v => v.setName(newID)))
            return e.preventDefault();
        setSelectedShapes([...selectedShapes]);
        setShapes([...shapes]);
    };

    return (
        <div className={`${styles['shape-list-window']} rounded`}>
            <ShapeListMenu setShapes={(shape: Shape) => setShapes([...shapes, shape])} />
            <div id="scroll-bar" className={`${styles['shape-list']} overflow-auto`}>
                <ListGroup>
                    {shapes.map(shape => (
                        <ShapeListItem
                            key={shape.name} id={shape.name}
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
