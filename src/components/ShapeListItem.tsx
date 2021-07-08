import React, { useState, useRef, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import styles from '../styles/ShapeListItem.module.scss';

interface ShapeListItemProps {
    index: number
    name: string
    isSelected: boolean
    onExitFocus: (newID: string) => void
    onSelect: (isPushCtrl: boolean) => void
    onDelete: () => void
    onSelectMove: (to: -1 | 1) => void
}

const ShapeListItem: React.FC<ShapeListItemProps> = ({ index, name, isSelected, onSelect, onExitFocus, onDelete, onSelectMove }) => {
    const [renameMode, setRenameMode] = useState<boolean>(false);
    const alreadyClicked = useRef(false);
    const inputElemRef = useRef<HTMLInputElement>(null);

    const onClick = (isPushCtrl: boolean) => {
        if (!alreadyClicked.current) {
            alreadyClicked.current = true;
            onSelect(isPushCtrl);
            setTimeout(() => alreadyClicked.current = false, 200);
        }
    };

    const onExitRename = () => {
        if (inputElemRef.current?.value) onExitFocus(inputElemRef.current.value);
        setRenameMode(false);
    };

    const onKeyDown = (key: string) => {
        switch (key) {
            case 'Enter':
                return renameMode ? onExitRename() : setRenameMode(true);
            case 'Escape':
                return setRenameMode(false);
            case 'Delete':
                return onDelete();
            case 'ArrowUp':
                return onSelectMove(-1);
            case 'ArrowDown':
                return onSelectMove(1);
        }
    };

    useEffect(() => inputElemRef.current?.focus(), [renameMode]);

    const renameElem = (
        <input
            className={styles['shape-list-item-input']}
            id={`shape-list-item-${index}`}
            ref={inputElemRef}
            onBlur={() => onExitRename()}
            onKeyDown={e => onKeyDown(e.key)}
            tabIndex={index === 0 ? 0 : -1}
        />
    );
    const textElem = (
        <div
            className={styles['shape-list-item-text']}
            id={`shape-list-item-${index}`}
            onClick={e => onClick(e.ctrlKey)}
            onDoubleClick={() => setRenameMode(true)}
            onKeyDown={e => onKeyDown(e.key)}
            tabIndex={index === 0 ? 0 : -1}
        >
            {name}
        </div>
    );

    return (
        <ListGroup.Item
            className={`${styles['shape-list-item']} ${isSelected ? styles['active'] : ''}`}
            action
            active={isSelected}
        >
            {renameMode ? renameElem : textElem}
        </ListGroup.Item>
    );
};

export default ShapeListItem;
