import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Inspector from './Inspector';
import Menu from './Menu';
import ShapeList from './ShapeList';
import styles from '../styles/UserInterface.module.scss';
import { Shape } from '../ShapeNodes';

interface UserInterfaceProps {
    shapes: Shape[]
    setShapes: (shapes: Shape[]) => void
    selectedShapes: Shape[],
    setSelectedShapes: (shapes: Shape[]) => void
}

const UserInterface: React.FC<UserInterfaceProps> = ({ shapes, setShapes, selectedShapes, setSelectedShapes }) => (
    <Container fluid className={styles['user-interface']}>
        <Row>
            <Col className={styles['col-inspector']}>
                <Inspector
                    shapes={shapes}
                    setShapes={setShapes}
                    selectedShapes={selectedShapes}
                    setSelectedShapes={setSelectedShapes}
                />
            </Col>
        </ Row>
        <Row>
            <Col xl={5} lg={5} md={12} sm={5} xs={12} className={styles['col-shape-list']}>
                <ShapeList
                    shapes={shapes}
                    setShapes={setShapes}
                    selectedShapes={selectedShapes}
                    setSelectedShapes={setSelectedShapes}
                />
            </ Col>
            <Col xl={7} lg={7} md={12} sm={7} xs={12} className={styles['col-menu']}>
                <Menu />
            </ Col>
        </ Row>
    </Container>
);

export default UserInterface;
