import React from 'react';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import { ShapesDispatch } from '../reducers/shapesReducer';
import { Shape } from '../ShapeNodes';
import styles from '../styles/Inspector.module.scss';
import { AbstractShapeNode, Parameter } from '../types/AbstractShapeNode';
import ParameterBox from './ParameterBox';

interface InspectorProps {
    shapes: Shape[]
    shapesDispatch: ShapesDispatch
}

const Inspector = ({ shapes, shapesDispatch }: InspectorProps): JSX.Element => {
    const paramBoxes = shapes.flatMap(<T extends string, U extends AbstractShapeNode<T>>(shape: U, i: number) => {
        if (!shape.isSelected) return;
        // TODO 複数選択時の挙動
        return shape.getParameterList().map((data: Parameter<T>) => (
            <Col key={`${shape.uuid}-${data.argID}`} xl={3} lg={4} md={6} sm={4} xs={6} >
                <ParameterBox data={data} index={i} shapesDispatch={shapesDispatch} />
            </Col>
        ));
    }).filter(v => v !== undefined) as JSX.Element[];

    return (
        <div className={styles['inspector']}>
            <Container fluid className={styles['inspector-param-box-container']}>
                <Row>
                    {paramBoxes}
                </Row>
            </Container>
        </div>
    );
};

export default React.memo(Inspector);
