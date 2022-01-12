import React from 'react';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import { ShapesDispatch } from '../reducers/shapesReducer';
import { Shape } from '../ShapeNodes';
import styles from '../styles/UserInterface.module.scss';
import { GridMode } from '../types/GridMode';
import { SpecificatedLanguage } from '../types/Language';
import { IndexedPoint } from '../types/Point';
import { StateDispatcher } from '../types/StateDispatcher';
import Inspector from './Inspector';
import Menu from './Menu';
import ShapeList from './ShapeList';

interface UserInterfaceProps {
    shapes: Shape[]
    latestSelect: number[]
    shapesDispatch: ShapesDispatch
    gridMode: GridMode
    setGridMode: StateDispatcher<GridMode>
    duplicatedPointRange: number
    setDuplicatedPointRange: StateDispatcher<number>
    language: SpecificatedLanguage
    setLanguage: StateDispatcher<string>
    setContextTarget: StateDispatcher<IndexedPoint | undefined>
    openImportModal: StateDispatcher<boolean>
    openExportModal: StateDispatcher<boolean>
}

const UserInterface = ({ shapes, latestSelect, shapesDispatch, gridMode, setGridMode, duplicatedPointRange, setDuplicatedPointRange, language, setLanguage, setContextTarget, openImportModal, openExportModal }: UserInterfaceProps): JSX.Element => (
    <Container fluid className={styles['user-interface']}>
        <Row noGutters>
            <Col className={styles['col-inspector']}>
                <Inspector {...{ shapes, shapesDispatch }} />
            </Col>
        </ Row>
        <Row noGutters>
            <Col xl={5} lg={5} md={12} sm={5} xs={12} className={styles['col-shape-list']}>
                <ShapeList
                    shapes={shapes.map(shape => ({ name: shape.name, uuid: shape.uuid, isSelected: shape.isSelected }))}
                    {...{ latestSelect, shapesDispatch, setContextTarget }}
                />
            </ Col>
            <Col xl={7} lg={7} md={12} sm={7} xs={12} className={styles['col-menu']}>
                <Menu
                    {...{
                        gridMode, setGridMode, duplicatedPointRange, setDuplicatedPointRange,
                        language, setLanguage, openImportModal, openExportModal
                    }}
                />
            </ Col>
        </ Row>
    </Container>
);

export default React.memo(UserInterface);
