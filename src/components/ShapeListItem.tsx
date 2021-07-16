import React, { useEffect, useRef, useState, useCallback } from 'react';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import { ShapesDispatch } from '../reducers/shapesReducer';
import styles from '../styles/ShapeListItem.module.scss';

interface ShapeListItemProps {
    index: number
    name: string
    isSelected: boolean
    onSelect: (index: number, isPushCtrl: boolean) => void
    onRename: (index: number, newID: string) => void
    onMoveSelect: (index: number, to: -1 | 1) => void
    showContextMenu: (index: number, e: React.MouseEvent<HTMLElement, MouseEvent>) => void
    shapesDispatch: ShapesDispatch
}

const ShapeListItem = ({ index, name, isSelected, onSelect, onRename, onMoveSelect, showContextMenu, shapesDispatch }: ShapeListItemProps): JSX.Element => {
    const [renameMode, setRenameMode] = useState<boolean>(false);
    const alreadyClicked = useRef(false);
    const inputElemRef = useRef<HTMLInputElement>(null);

    const onClick = useCallback(({ ctrlKey: isPushCtrl }: { ctrlKey: boolean }) => {
        if (!alreadyClicked.current) {
            alreadyClicked.current = true;
            onSelect(index, isPushCtrl);
            setTimeout(() => alreadyClicked.current = false, 200);
        }
    }, [index, onSelect]);

    const onDoubleClick = useCallback(() => setRenameMode(true), []);

    const onExitRenameMode = useCallback(() => {
        if (inputElemRef.current?.value)
            onRename(index, inputElemRef.current.value);
        setRenameMode(false);
    }, [index, onRename]);

    const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLElement>) => {
        e.stopPropagation();
        switch (e.key) {
            case 'Enter':
                return renameMode ? onExitRenameMode() : setRenameMode(true);
            case 'F2':
                return setRenameMode(true);
            case 'Escape':
                return setRenameMode(false);
            case 'Delete':
                return shapesDispatch({ type: 'delete' });
            case 'ArrowUp':
                return onMoveSelect(index, -1);
            case 'ArrowDown':
                return onMoveSelect(index, +1);
        }
    }, [index, onExitRenameMode, onMoveSelect, renameMode, shapesDispatch]);

    const onContextMenu = useCallback((e: React.MouseEvent<HTMLElement, MouseEvent>) => showContextMenu(index, e), [index, showContextMenu]);

    useEffect(() => {
        if (renameMode && inputElemRef.current) {
            inputElemRef.current.value = name;
            inputElemRef.current.focus();
            inputElemRef.current.select();
        }
    }, [name, renameMode]);

    const renameElem = (
        <input
            className={styles['shape-list-item-input']}
            id={`shape-list-item-${index}`}
            ref={inputElemRef}
            onBlur={onExitRenameMode}
            tabIndex={index === 0 ? 0 : -1}
        />
    );
    const textElem = (
        <div
            className={styles['shape-list-item-text']}
            id={`shape-list-item-${index}`}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
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
            onKeyDown={onKeyDown}
        >
            {renameMode ? renameElem : textElem}
        </ListGroup.Item >
    );
};

export default React.memo(ShapeListItem);
