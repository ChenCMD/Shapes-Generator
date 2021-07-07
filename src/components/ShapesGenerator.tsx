import React, { useState } from 'react';
import Previewer from './Previewer';
import { Container, Row, Col } from 'react-bootstrap';
import UserInterface from './UserInterface';
import styles from '../styles/ShapesGenerator.module.scss';
import { Shape } from '../ShapeNodes';
import { GridMode } from '../types/GridMode';
import { Point } from '../types/Point';
import { toFracString } from '../utils/common';

const ShapesGenerator: React.FC = () => {
    const [shapes, setShapes] = useState<Shape[]>([]);
    const [selectedShapes, setSelectedShapes] = useState<Shape[]>([]);
    const [gridMode, setGridMode] = useState<GridMode>(GridMode.center);
    const [duplicatedPointRange, setDuplicatedPointRange] = useState<number>(0);

    const generateExportFile = () =>
        shapes.flatMap(
            shape => shape.pointSet.map(
                ({ pos: [x, y] }) => {
                    const mkCmd = (pos: Point) =>
                        `particle end_rod ^${toFracString(pos[0])} ^ ^${toFracString(pos[1])} ^${toFracString(pos[0] * 2)} ^${toFracString(pos[1] * 2)} ^ 0.0015 0`;
                    return mkCmd([Math.floor(x * 1000) / 1000, Math.floor(y * 1000) / 1000]);
                }
            )
        ).join('\n');

    return (
        <div className={styles['shapes-generator']}>
            <Container fluid>
                <Row>
                    <Col xl={6} lg={6} md={6} sm={12} xs={12} className={styles['col-previewer']}>
                        <Previewer
                            shapePoints={shapes.map(shape => ({ selected: selectedShapes.includes(shape), points: shape.pointSet }))}
                            gridMode={gridMode}
                            duplicatedPointRange={duplicatedPointRange}
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
                            generateExportFile={generateExportFile}
                        />
                    </Col>
                </ Row>
            </Container>
        </div>
    );
};

export default ShapesGenerator;
