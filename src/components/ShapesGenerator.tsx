import React, { useState, useMemo, useCallback, useReducer, useEffect, useRef } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import createReducer from '../reducers/shapesReducer'; '../reducers/shapesReducer';
import styles from '../styles/ShapesGenerator.module.scss';
import { GridMode } from '../types/GridMode';
import { deleteDuplicatedPoints } from '../types/Point';
import { createKeyboardEvent } from '../utils/element';
import ContextMenu from './ContextMenu';
import ExportModal from './ExportModal';
import Previewer from './Previewer';
import UserInterface from './UserInterface';

const ShapesGenerator = (): JSX.Element => {
    const immediatelyAfterExport = useRef<boolean>(true);
    const [[shapes, latestSelect], shapesDispatch] = useReducer(createReducer(() => immediatelyAfterExport.current = false), [[], []]);
    const [gridMode, setGridMode] = useState<GridMode>(GridMode.block);
    const [duplicatedPointRange, setDuplicatedPointRange] = useState<number>(0);
    const [isOpenExportModal, setIsOpenExportModal] = useState<boolean>(false);
    const [contextTarget, setContextTarget] = useState<{ x: number, y: number, index: number } | undefined>();

    useEffect(() => {
        const onBeforeUnload = (e: BeforeUnloadEvent) => {
            if (!immediatelyAfterExport.current) {
                e.preventDefault();
                e.returnValue = '出力されていないデータが存在します。本当に閉じますか？';
            }
        };
        window.addEventListener('beforeunload', onBeforeUnload);
        return () => window.removeEventListener('beforeunload', onBeforeUnload);
    });

    const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLElement>) => {
        console.log(`root/onKeyDown: ${e.key}`);
        if (contextTarget && e.key === 'Escape') return setContextTarget(undefined);
        // こっちでは処理できないキー
        const elem = document.getElementById(`shape-list-item-${latestSelect.slice(-1)[0]}`);
        elem?.dispatchEvent(createKeyboardEvent(e.key, e.altKey, e.ctrlKey, e.shiftKey));
    }, [contextTarget, latestSelect]);

    const onContextCloseRequest = useCallback(() => setContextTarget(undefined), []);

    const dependString = useMemo(() => shapes.map(v => `${v.isSelected ? 1 : 0}${v.pointSet.map(v2 => v2.id).join('+')}`).join('+'), [shapes]);
    const points = useMemo(() => {
        const res = shapes.flatMap(shape => shape.pointSet.map(v => ({ selected: shape.isSelected, point: v })));
        return duplicatedPointRange === 0
            ? res
            : deleteDuplicatedPoints(res, duplicatedPointRange);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [duplicatedPointRange, dependString]);

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
                            shapesDispatch={shapesDispatch}
                            gridMode={gridMode}
                            setGridMode={setGridMode}
                            duplicatedPointRange={duplicatedPointRange}
                            setDuplicatedPointRange={setDuplicatedPointRange}
                            setContextTarget={setContextTarget}
                            openExportModal={setIsOpenExportModal}
                        />
                    </Col>
                </ Row>
            </Container>
            <ExportModal
                points={points.map(v => v.point.pos)}
                isOpen={isOpenExportModal}
                openExportModal={setIsOpenExportModal}
                duplicatedPointRange={duplicatedPointRange}
                setDuplicatedPointRange={setDuplicatedPointRange}
                immediatelyAfterExport={immediatelyAfterExport}
            />
            <ContextMenu
                x={contextTarget?.x}
                y={contextTarget?.y}
                index={contextTarget?.index}
                onCloseRequest={onContextCloseRequest}
                shapesDispatch={shapesDispatch}
            />
        </>
    );
};

export default ShapesGenerator;
