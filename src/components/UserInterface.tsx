import React from 'react';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import { ShapesDispatch } from '../reducers/shapesReducer';
import { Shape } from '../ShapeNodes';
import styles from '../styles/UserInterface.module.scss';
import { GridMode } from '../types/GridMode';
import Inspector from './Inspector';
import Menu from './Menu';
import ShapeList from './ShapeList';

interface UserInterfaceProps {
    shapes: Shape[]
    shapesDispatch: ShapesDispatch
    gridMode: GridMode
    setGridMode: (mode: GridMode) => void
    duplicatedPointRange: number
    setDuplicatedPointRange: (value: number) => void
    setContextTarget: (context: { x: number, y: number, index: number }) => void
    openExportModal: (isOpen: boolean) => void;
}

const UserInterface = ({ shapes, shapesDispatch, gridMode, setGridMode, duplicatedPointRange, setDuplicatedPointRange, setContextTarget, openExportModal }: UserInterfaceProps): JSX.Element => (
    <Container fluid className={styles['user-interface']}>
        <Row>
            <Col className={styles['col-inspector']}>
                <Inspector
                    shapes={shapes}
                    shapesDispatch={shapesDispatch}
                />
            </Col>
        </ Row>
        <Row>
            <Col xl={5} lg={5} md={12} sm={5} xs={12} className={styles['col-shape-list']}>
                <ShapeList
                    shapes={shapes.map(shape => ({ name: shape.name, uuid: shape.uuid, isSelected: shape.isSelected }))}
                    shapesLength={shapes.length}
                    shapesDispatch={shapesDispatch}
                    setContextTarget={setContextTarget}
                />
            </ Col>
            <Col xl={7} lg={7} md={12} sm={7} xs={12} className={styles['col-menu']}>
                <Menu
                    gridMode={gridMode}
                    setGridMode={setGridMode}
                    duplicatedPointRange={duplicatedPointRange}
                    setDuplicatedPointRange={setDuplicatedPointRange}
                    openExportModal={openExportModal}
                />
            </ Col>
        </ Row>
    </Container>
);

export default React.memo(UserInterface);
