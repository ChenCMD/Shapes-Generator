import React, { useCallback, useEffect, useRef, useState } from 'react';
import ListGroup from 'react-bootstrap/esm/ListGroup';
import useOnceKeydown from '../hooks/useOnceKeydown';
import { ShapesDispatch } from '../reducers/shapesReducer';
import styles from '../styles/ShapeListItem.module.scss';

interface ShapeListItemProps {
    index: number
    name: string
    isSelected: boolean
    onSelect: (index: number, isPushCtrl: boolean) => void
    onMoveSelect: (index: number, to: -1 | 1) => void
    onDuplicate: (index: number) => void
    showContextMenu: (index: number, e: React.MouseEvent<HTMLElement, MouseEvent>) => void
    shapesDispatch: ShapesDispatch
}

const ShapeListItem = ({ index, name, isSelected, onSelect, onMoveSelect, onDuplicate, showContextMenu, shapesDispatch }: ShapeListItemProps): JSX.Element => {
    const [renameMode, setRenameMode] = useState<boolean>(false);
    const inputElemRef = useRef<HTMLInputElement>(null);

    const onClick = useCallback(({ ctrlKey: isPushCtrl }: { ctrlKey: boolean }) => onSelect(index, isPushCtrl), [index, onSelect]);

    const onDoubleClick = useCallback(() => setRenameMode(true), []);

    const onExitRenameMode = useCallback(() => {
        if (inputElemRef.current?.value)
            shapesDispatch({ type: 'rename', index, newName: inputElemRef.current.value });
        setRenameMode(false);
    }, [index, shapesDispatch]);

    const keyDownCallbacks: { [k: string]: (e: React.KeyboardEvent<HTMLElement>) => void } = {};
    const keyUpCallbacks: { [k: string]: (e: React.KeyboardEvent<HTMLElement>) => void } = {};
    [keyDownCallbacks['Enter'], keyUpCallbacks['Enter']] = useOnceKeydown('Enter', () => renameMode ? onExitRenameMode() : setRenameMode(true));
    [keyDownCallbacks['F2'], keyUpCallbacks['F2']] = useOnceKeydown('F2', () => setRenameMode(true));
    [keyDownCallbacks['Escape'], keyUpCallbacks['Escape']] = useOnceKeydown('Escape', () => setRenameMode(false));
    [keyDownCallbacks['Delete'], keyUpCallbacks['Delete']] = useOnceKeydown('Delete', () => shapesDispatch({ type: 'delete' }));
    [keyDownCallbacks['D'], keyUpCallbacks['D']] = useOnceKeydown('D', e => e.shiftKey && onDuplicate(index));
    [keyDownCallbacks['ArrowUp'], keyUpCallbacks['ArrowUp']] = useOnceKeydown('ArrowUp', () => onMoveSelect(index, -1));
    [keyDownCallbacks['ArrowDown'], keyUpCallbacks['ArrowDown']] = useOnceKeydown('ArrowDown', () => onMoveSelect(index, +1));

    const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        e.stopPropagation();
        keyDownCallbacks[e.key]?.(e);
    };

    const onKeyUp = (e: React.KeyboardEvent<HTMLElement>) => keyUpCallbacks[e.key]?.(e);

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
            className={styles['input']}
            id={`shape-list-item-${index}`}
            ref={inputElemRef}
            onBlur={onExitRenameMode}
            tabIndex={index === 0 ? 0 : -1} // stopPropagationは一つ親でやってるので要らない
        />
    );
    const textElem = (
        <div
            className={styles['text']}
            id={`shape-list-item-${index}`}
            {...{ onClick, onDoubleClick }}
            tabIndex={index === 0 ? 0 : -1}
        >
            {name}
        </div>
    );

    return (
        <ListGroup.Item
            className={styles['item']}
            action
            active={isSelected}
            {...{ onContextMenu, onKeyDown, onKeyUp }}
        >
            {renameMode ? renameElem : textElem}
        </ListGroup.Item >
    );
};

export default React.memo(ShapeListItem);
