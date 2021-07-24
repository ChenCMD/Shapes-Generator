import React, { useCallback, useEffect, useRef } from 'react';
import useWindowSize from '../hooks/useWindowSize';
import { ShapesDispatch } from '../reducers/shapesReducer';
import styles from '../styles/ContextMenu.module.scss';
import { createKeyboardEvent, getParentsId } from '../utils/element';

interface ContextMenuProps {
    x?: number
    y?: number
    index?: number
    onCloseRequest: () => void
    shapesDispatch: ShapesDispatch
}

const ContextMenu = ({ x, y, index, onCloseRequest, shapesDispatch }: ContextMenuProps): JSX.Element => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLTableSectionElement>(null);
    const { width, height } = useWindowSize();

    useEffect(() => {
        if (menuRef.current && overlayRef.current) {
            if (x !== undefined && y !== undefined) {
                overlayRef.current.classList.add('visible');
                menuRef.current.classList.add('visible');
                menuRef.current.style.top = `${y + menuRef.current.clientHeight < height ? y : y - menuRef.current.clientHeight}px`;
                menuRef.current.style.left = `${x + menuRef.current.clientWidth < width ? x : width - menuRef.current.clientWidth - 8}px`;
                menuRef.current.focus();
            } else {
                overlayRef.current.classList.remove('visible');
                menuRef.current.classList.remove('visible');
            }
        }
    }, [width, height, x, y]);

    const onContextMenu = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();
        if (overlayRef.current) {
            onCloseRequest();
            const elem = document.elementsFromPoint(e.clientX, e.clientY)[1] as HTMLElement;
            if (getParentsId(elem).includes('context-menu'))
                return;
            const event = document.createEvent('MouseEvents');
            event.initMouseEvent('contextmenu', e.bubbles, e.cancelable, elem.ownerDocument.defaultView ?? window, 1,
                e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, null);
            elem.dispatchEvent(event);
        }
    }, [onCloseRequest]);

    const onDelete = useCallback(() => shapesDispatch({ type: 'delete' }), [shapesDispatch]);

    const onRename = useCallback(() => document.getElementById(`shape-list-item-${index}`)?.dispatchEvent(createKeyboardEvent('F2', false, false, false)), [index]);
    const onDuplicate = useCallback(() => document.getElementById(`shape-list-item-${index}`)?.dispatchEvent(createKeyboardEvent('D', false, false, true)), [index]);

    return (
        <div
            className={`${styles['overlay']}`} ref={overlayRef} id="context-menu"
            onClick={onCloseRequest} onContextMenu={onContextMenu}>
            <table>
                <tbody ref={menuRef} className={`${styles['window']}`}>
                    <tr className={styles['item']} onClick={onDuplicate}>
                        <td align="right" className={styles['text']}>複製</td>
                        <td className={styles['shortcut']}>Shift + D</td>
                    </tr>
                    <tr><td colSpan={2}><div className={styles['line']} /></td></tr>
                    <tr className={styles['item']} onClick={onRename}>
                        <td align="right" className={styles['text']}>名前の変更</td>
                        <td className={styles['shortcut']}>F2</td>
                    </tr>
                    <tr className={styles['item']} onClick={onDelete}>
                        <td align="right" className={styles['text']}>削除</td>
                        <td className={styles['shortcut']}>Delete</td>
                    </tr>
                </tbody>
            </table>
        </div >
    );
};

export default React.memo(ContextMenu);
