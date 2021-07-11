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
    setContextTarget: (context: { x: number, y: number }) => void
}

const ShapeListItem: React.FC<ShapeListItemProps> = ({ index, name, isSelected, onSelect, onExitFocus, onDelete, onSelectMove, setContextTarget }) => {
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

    const onContextMenu = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
        onSelect(e.ctrlKey);
        setContextTarget({ x: e.clientX, y: e.clientY});
    };

    useEffect(() => inputElemRef.current?.focus(), [renameMode]);

    const renameElem = (
        <input
            className={styles['shape-list-item-input']}
            ref={inputElemRef}
            onBlur={() => onExitRename()}
            onKeyDown={e => onKeyDown(e.key)}
            tabIndex={index === 0 ? 0 : -1}
        />
    );
    const textElem = (
        <div
            className={styles['shape-list-item-text']}
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
            className={styles['shape-list-item']}
            action
            active={isSelected}
            onContextMenu={onContextMenu}
        >
            {renameMode ? renameElem : textElem}
        </ListGroup.Item >
    );
};

export default ShapeListItem;
