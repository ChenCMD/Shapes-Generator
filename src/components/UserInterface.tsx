import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Shape } from '../types/Shape';
import Inspector from './Inspector';
import Menu from './Menu';
import ShapeList from './ShapeList';

interface UserInterfaceProps {
    shapes: Shape[]
    setShapes: (shapes: Shape[]) => void
    selectedShapes: Shape[],
    setSelectedShapes: (shapes: Shape[]) => void
}

const UserInterface: React.FC<UserInterfaceProps> = ({ shapes, setShapes, selectedShapes, setSelectedShapes }) => (
    <Container fluid className="user-interface">
        <Row>
            <Col>
                <Inspector
                    selectedShapes={selectedShapes}
                    setSelectedShapes={setSelectedShapes}
                    shapes={shapes}
                    setShapes={setShapes}
                />
            </Col>
        </ Row>
        <Row>
            <Col xl={5} lg={5} md={5} sm={5} xs={5} className="col-shape-list">
                <ShapeList
                    shapes={shapes}
                    setShapes={setShapes}
                    selectedShapes={selectedShapes}
                    setSelectedShapes={setSelectedShapes}
                />
            </ Col>
            <Col xl={7} lg={7} md={7} sm={7} xs={7} className="col-menu"><Menu /></ Col>
        </ Row>
    </Container>
);

export default UserInterface;
