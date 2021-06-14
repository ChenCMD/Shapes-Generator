import React, { useState, useRef, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { Shape } from '../types/Shape';
import styles from '../styles/ShapeListItem.module.scss';

interface ShapeListItemProps {
    id: string
    selectedShapes: Shape[]
    onExitFocus: (targetID: string, newID: string) => void
    onSelect: (targetID: string, isPushCtrl: boolean) => void
}

const ShapeListItem: React.FC<ShapeListItemProps> = ({ selectedShapes, id, onSelect, onExitFocus }) => {
    const [renameMode, setRenameMode] = useState<boolean>(false);
    const alreadyClicked = useRef(false);
    const inputElemRef = useRef<HTMLInputElement>(null);
    const selected = selectedShapes.some(v => v.id === id);

    const onClick = ({ currentTarget: { textContent }, ctrlKey }: React.MouseEvent) => {
        if (!alreadyClicked.current) {
            alreadyClicked.current = true;
            if (textContent) onSelect(textContent, ctrlKey);
            setTimeout(() => alreadyClicked.current = false, 200);
        }
    };

    const onExitRename = () => {
        if (inputElemRef.current?.value) onExitFocus(id, inputElemRef.current.value);
        setRenameMode(false);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') onExitRename();
        if (e.key === 'Escape') setRenameMode(false);
    };

    useEffect(() => inputElemRef.current?.focus(), [renameMode]);

    const renameElem = (<input className={styles['shape-list-item-input']} ref={inputElemRef} onBlur={() => onExitRename()} onKeyDown={e => onKeyDown(e)} />);
    const textElem = (<div className={styles['shape-list-item-text']} onClick={e => onClick(e)} onDoubleClick={() => setRenameMode(true)}>{id}</div>);

    return (
        <ListGroup.Item
            className={`${styles['shape-list-item']} ${selected ? styles['shape-list-item-active'] : ''}`}
            action
            active={selected}
        >
            {renameMode ? renameElem : textElem}
        </ListGroup.Item>
    );
};

export default ShapeListItem;
