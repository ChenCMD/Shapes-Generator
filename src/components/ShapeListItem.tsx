import React, { useState, useRef, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { Shape } from '../ShapeNodes';
import styles from '../styles/ShapeListItem.module.scss';

interface ShapeListItemProps {
    name: string
    selectedShapes: Shape[]
    onExitFocus: (e: { preventDefault: () => void }, newID: string) => void
    onSelect: (isPushCtrl: boolean) => void
    onDelete: () => void
}

const ShapeListItem: React.FC<ShapeListItemProps> = ({ selectedShapes, name, onSelect, onExitFocus, onDelete }) => {
    const [renameMode, setRenameMode] = useState<boolean>(false);
    const alreadyClicked = useRef(false);
    const inputElemRef = useRef<HTMLInputElement>(null);
    const selected = selectedShapes.some(v => v.name === name);

    const onClick = (isPushCtrl: boolean) => {
        if (!alreadyClicked.current) {
            alreadyClicked.current = true;
            onSelect(isPushCtrl);
            setTimeout(() => alreadyClicked.current = false, 200);
        }
    };

    const onExitRename = (e: { preventDefault: () => void }) => {
        if (inputElemRef.current?.value) onExitFocus(e, inputElemRef.current.value);
        setRenameMode(false);
    };

    const onKeyDown = (e: { preventDefault: () => void, key: string }) => {
        console.log(`onKeyDown: ${e.key}`);
        if (e.key === 'Enter' && renameMode) onExitRename(e);
        if (e.key === 'Enter' && !renameMode) setRenameMode(true);
        if (e.key === 'Escape') setRenameMode(false);
        if (e.key === 'Delete') onDelete();
    };

    useEffect(() => inputElemRef.current?.focus(), [renameMode]);

    const renameElem = (
        <input
            className={styles['shape-list-item-input']}
            ref={inputElemRef}
            onBlur={e => onExitRename(e)}
            onKeyDown={e => onKeyDown(e)}
        />
    );
    const textElem = (
        <div
            className={styles['shape-list-item-text']}
            onClick={e => onClick(e.ctrlKey)}
            onDoubleClick={() => setRenameMode(true)}
            onKeyDown={e => onKeyDown(e)}
            tabIndex={-1}
        >
            {name}
        </div>
    );

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
