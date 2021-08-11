import React, { useCallback, useMemo, useReducer, useState } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import { toast, ToastContainer } from 'react-toastify';
import useWindowCloseWarning from '../hooks/useWindowCloseWarning';
import createReducer from '../reducers/shapesReducer';
import { Shape } from '../ShapeNodes';
import styles from '../styles/ShapesGenerator.module.scss';
import { GridMode } from '../types/GridMode';
import { deleteDuplicatedPoints } from '../types/Point';
import { createKeyboardEvent } from '../utils/element';
import ContextMenu from './ContextMenu';
import ExportModal from './ExportModal';
import ImportModal from './ImportModal';
import Previewer from './Previewer';
import UserInterface from './UserInterface';

export const showNotification = (type: 'info' | 'success' | 'warning' | 'error' | 'dark', message: string): void => {
    toast[type](message, {
        position: 'bottom-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
    });
};

interface ShapesGeneratorProps {
    defaultShapes?: Shape[]
}

const ShapesGenerator = ({ defaultShapes }: ShapesGeneratorProps): JSX.Element => {
    const isNotSaved = useWindowCloseWarning();
    const [[shapes, latestSelect], shapesDispatch] = useReducer(createReducer(() => isNotSaved.current = true), [defaultShapes ?? [], []]);
    const [gridMode, setGridMode] = useState<GridMode>(GridMode.block);
    const [duplicatedPointRange, setDuplicatedPointRange] = useState<number>(0);
    const [isOpenExportModal, setIsOpenExportModal] = useState<boolean>(false);
    const [isOpenImportModal, setIsOpenImportModal] = useState<boolean>(false);
    const [contextTarget, setContextTarget] = useState<{ x: number, y: number, index: number } | undefined>();

    const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLElement>) => {
        if (contextTarget && e.key === 'Escape') return setContextTarget(undefined);
        // こっちでは処理できないキー
        const elem = document.getElementById(`shape-list-item-${latestSelect.slice(-1)[0]}`);
        elem?.dispatchEvent(createKeyboardEvent('keydown', e.key, e.altKey, e.ctrlKey, e.shiftKey));
    }, [contextTarget, latestSelect]);

    const onContextCloseRequest = useCallback(() => setContextTarget(undefined), []);

    const dependString = useMemo(() => shapes.map(v => `${v.isSelected ? 1 : 0}${v.points.map(v2 => v2.id).join('+')}`).join('+'), [shapes]);
    const [points, pointsWithoutManipulate] = useMemo(() => {
        const p = deleteDuplicatedPoints(shapes, duplicatedPointRange);
        return [p, p.filter(v => !v.isManipulateShape)];
    },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [duplicatedPointRange, dependString]);
    return (
        <>
            <Container fluid className={styles['container']} onKeyDown={onKeyDown} tabIndex={-1}>
                <Row noGutters>
                    <Col xl={6} lg={6} md={12} sm={12} xs={12}>
                        <Previewer
                            shapes={points}
                            gridMode={gridMode}
                        />
                    </Col>
                    <Col xl={6} lg={6} md={12} sm={12} xs={12}>
                        <UserInterface
                            shapes={shapes}
                            latestSelect={latestSelect}
                            shapesDispatch={shapesDispatch}
                            gridMode={gridMode}
                            setGridMode={setGridMode}
                            duplicatedPointRange={duplicatedPointRange}
                            setDuplicatedPointRange={setDuplicatedPointRange}
                            setContextTarget={setContextTarget}
                            openImportModal={setIsOpenImportModal}
                            openExportModal={setIsOpenExportModal}
                        />
                    </Col>
                </ Row>
            </Container>
            <ImportModal
                isOpen={isOpenImportModal}
                openImportModal={setIsOpenImportModal}
                shapesDispatch={shapesDispatch}
            />
            <ExportModal
                importStrings={shapes.map(v => v.toExportObject())}
                points={pointsWithoutManipulate}
                isOpen={isOpenExportModal}
                openExportModal={setIsOpenExportModal}
                duplicatedPointRange={duplicatedPointRange}
                setDuplicatedPointRange={setDuplicatedPointRange}
                isNotSaved={isNotSaved}
            />
            <ContextMenu
                x={contextTarget?.x}
                y={contextTarget?.y}
                index={contextTarget?.index}
                onCloseRequest={onContextCloseRequest}
                shapesDispatch={shapesDispatch}
            />
            <ToastContainer
                position="bottom-left"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable={false}
                pauseOnHover
                limit={5}
            />
        </>
    );
};

export default ShapesGenerator;
