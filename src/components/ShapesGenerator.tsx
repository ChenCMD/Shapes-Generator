import React, { useState } from 'react';
import Previewer from './Previewer';
import { Shape } from '../types/Shape';
import { Container, Row, Col } from 'react-bootstrap';
import UserInterface from './UserInterface';

// const drawCircle = (id: string, radius: number, count: number, start = 0): Point[] => {
//     const elements: Point[] = [];
//     for (let i = start; i < 360 + start; i += 360 / count) {
//         const x = Math.cos(toRadians(i)) * radius;
//         const y = Math.sin(toRadians(i)) * radius;
//         elements.push({ id: `${id}-${x}-${y}`, x, y });
//     }
//     return elements;
// };

const ShapesGenerator: React.FC = () => {
    const [shapes, setShapes] = useState<Shape[]>([]);
    return (
        <Container fluid className="p-3">
            <Row>
                <Col xl={6} lg={6} md={6} sm={12} xs={12} className="col-previewer"><Previewer shapePoints={shapes.map(v => v.pointSet)} /></Col>
                <Col xl={6} lg={6} md={6} sm={12} xs={12} className="col-user-interface">
                    <UserInterface shapes={shapes} setShapes={setShapes} />
                </Col>
            </ Row>
        </Container>
    );
};

export default ShapesGenerator;
