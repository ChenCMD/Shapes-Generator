import React, { useCallback, useEffect, useRef } from 'react';
import useWindowSize from '../hooks/useWindowSize';
import { ShapesDispatch } from '../reducers/shapesReducer';
import styles from '../styles/ContextMenu.module.scss';

interface ContextMenuProps {
    x?: number
    y?: number
    onCloseRequest: () => void
    shapesDispatch: ShapesDispatch
}

const ContextMenu = ({ x, y, onCloseRequest, shapesDispatch }: ContextMenuProps): JSX.Element => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLTableSectionElement>(null);
    const { width, height } = useWindowSize();

    useEffect(() => {
        if (menuRef.current && overlayRef.current) {
            if (x !== undefined && y !== undefined) {
                overlayRef.current.classList.add('visible');
                menuRef.current.classList.add('visible');
                menuRef.current.style.top = `${y + menuRef.current.clientHeight < height ? y : y - menuRef.current.clientHeight - 3}px`;
                menuRef.current.style.left = `${x + menuRef.current.clientWidth < width ? x : width - menuRef.current.clientWidth - 3}px`;
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
            overlayRef.current.style.visibility = 'hidden';
            onCloseRequest();
            const elem = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
            const event = document.createEvent('MouseEvents');
            event.initMouseEvent('contextmenu', e.bubbles, e.cancelable, elem.ownerDocument.defaultView ?? new Window(), 1,
                e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, null);
            elem.dispatchEvent(event);
            overlayRef.current.style.visibility = '';
        }
    }, [onCloseRequest]);

    const onDelete = useCallback(() => shapesDispatch({ type: 'delete' }), [shapesDispatch]);

    return (
        <div className={`${styles['overlay']}`} ref={overlayRef} onClick={onCloseRequest} onContextMenu={onContextMenu}>
            <table>
                <tbody
                    ref={menuRef}
                    className={`${styles['window']}`}
                >
                    <tr className={styles['item']} onClick={onDelete}>
                        <td align="right" className={styles['text']}>削除</td>
                        <td className={styles['shortcut']}>Delete</td>
                    </tr>
                    {/* <tr className={styles['item']}>
                        <td align="right" className={styles['text']}>複製</td>
                        <td className={styles['shortcut']}>Ctrl + D</td>
                    </tr> */}
                </tbody>
            </table>
        </div >
    );
};

export default React.memo(ContextMenu);
