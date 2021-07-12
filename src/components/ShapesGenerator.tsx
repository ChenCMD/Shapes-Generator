import React, { useState } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import { Shape } from '../ShapeNodes';
import styles from '../styles/ShapesGenerator.module.scss';
import { GridMode } from '../types/GridMode';
import { deleteDuplicatedPoints } from '../types/Point';
import ContextMenu from './ContextMenu';
import ExportModal from './ExportModal';
import Previewer from './Previewer';
import UserInterface from './UserInterface';

const ShapesGenerator = (): JSX.Element => {
    const [shapes, setShapes] = useState<Shape[]>([]);
    const [selectedShapes, setSelectedShapes] = useState<Shape[]>([]);
    const [gridMode, setGridMode] = useState<GridMode>(GridMode.block);
    const [duplicatedPointRange, setDuplicatedPointRange] = useState<number>(0);
    const [isOpenExportModal, setIsOpenExportModal] = useState<boolean>(false);
    const [contextTarget, setContextTarget] = useState<{ x: number, y: number } | undefined>();

    const onDelete = () => {
        setSelectedShapes([]);
        setShapes(shapes.filter(v => !selectedShapes.includes(v)));
    };

    const onKeyDown = ({ key }: { key: string }) => {
        if (contextTarget && key === 'Escape') setContextTarget(undefined);
        if (selectedShapes && key === 'Delete') {
            setSelectedShapes([]);
            setShapes(shapes.filter(v => !selectedShapes.includes(v)));
        }
    };

    const points = deleteDuplicatedPoints(
        shapes.flatMap(shape => {
            const selected = selectedShapes.includes(shape);
            return shape.pointSet.map(v => ({ selected, point: v }));
        }),
        duplicatedPointRange
    );

    return (
        <div className={styles['shapes-generator']} onKeyDown={onKeyDown}>
            <Container fluid>
                <Row>
                    <Col xl={6} lg={6} md={6} sm={12} xs={12} className={styles['col-previewer']}>
                        <Previewer
                            shapes={points}
                            gridMode={gridMode}
                        />
                    </Col>
                    <Col xl={6} lg={6} md={6} sm={12} xs={12} className={styles['col-user-interface']}>
                        <UserInterface
                            shapes={shapes}
                            setShapes={setShapes}
                            selectedShapes={selectedShapes}
                            setSelectedShapes={setSelectedShapes}
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
            />
            <ContextMenu
                x={contextTarget?.x}
                y={contextTarget?.y}
                onCloseRequest={() => setContextTarget(undefined)}
                onDelete={onDelete}
            />
        </div>
    );
};

export default ShapesGenerator;
