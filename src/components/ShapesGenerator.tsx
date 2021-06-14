import React, { useState } from 'react';
import Previewer from './Previewer';
import { Shape } from '../types/Shape';
import { Container, Row, Col } from 'react-bootstrap';
import UserInterface from './UserInterface';
import styles from '../styles/ShapesGenerator.module.scss';

const ShapesGenerator: React.FC = () => {
    const [shapes, setShapes] = useState<Shape[]>([]);
    const [selectedShapes, setSelectedShapes] = useState<Shape[]>([]);
    console.log(shapes);
    console.log(selectedShapes);
    return (
        <div className={styles['shapes-generator']}>
            <Container fluid>
                <Row>
                    <Col xl={6} lg={6} md={6} sm={12} xs={12} className={styles['col-previewer']}>
                        <Previewer
                            shapePoints={shapes.map(v => v.pointSet)}
                            selectedIDs={selectedShapes.map(v => v.id)}
                        /></Col>
                    <Col xl={6} lg={6} md={6} sm={12} xs={12} className={styles['col-user-interface']}>
                        <UserInterface
                            shapes={shapes}
                            setShapes={setShapes}
                            selectedShapes={selectedShapes}
                            setSelectedShapes={setSelectedShapes}
                        />
                    </Col>
                </ Row>
            </Container>
        </div>
    );
};

export default ShapesGenerator;
