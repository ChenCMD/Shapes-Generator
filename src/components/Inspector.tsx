import React from 'react';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import { Shape } from '../ShapeNodes';
import styles from '../styles/Inspector.module.scss';
import { AbstractShapeNode } from '../types/AbstractShapeNode';
import ParameterBox from './ParameterBox';

interface InspectorProps {
    shapes: Shape[]
    setShapes: (shapes: Shape[]) => void
    selectedShapes: Shape[]
    setSelectedShapes: (shapes: Shape[]) => void
}

const Inspector = ({ shapes, setShapes, selectedShapes, setSelectedShapes }: InspectorProps): JSX.Element => {
    const paramBoxes = selectedShapes.flatMap(<T extends string, U extends AbstractShapeNode<T>>(shape: U) =>
        shape.getParameterList().map(({ argID, value, name, description }) => {
            const updateParam = (newParam: string) => {
                shape.setParameter(argID, newParam);
                setSelectedShapes([...selectedShapes]);
                setShapes([...shapes]);
            };
            return (
                <Col key={`${shape.name}-${argID}`} xl={3} lg={4} md={6} sm={4} xs={6} >
                    <ParameterBox name={name} description={description} updateParam={updateParam} value={value} />
                </Col>
            );
        })
    );

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

export default Inspector;
