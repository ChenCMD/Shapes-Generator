import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Shape } from '../types/Shape';
import Inspector from './Inspector';
import Menu from './Menu';
import ShapeList from './ShapeList';

interface UserInterfaceProps {
    shapes: Shape[]
    setShapes: (shapes: Shape[]) => void
}

const UserInterface: React.FC<UserInterfaceProps> = ({ shapes, setShapes }) => {
    const [selectedShapes, setSelectedShapes] = useState<Shape[]>([]);

    return (
        <Container fluid className="user-interface">
            <Row>
                <Col><Inspector selectedShapes={selectedShapes} /></Col>
            </ Row>
            <Row>
                <Col xl={4} lg={4} md={4} sm={4} xs={4} className="col-shape-list">
                    <ShapeList
                        shapes={shapes}
                        setShapes={setShapes}
                        selectedShapes={selectedShapes}
                        setSelectedShapes={setSelectedShapes}
                    />
                </ Col>
                <Col xl={8} lg={8} md={8} sm={8} xs={8} className="col-menu"><Menu /></ Col>
            </ Row>
        </Container>
    );
};

export default UserInterface;
