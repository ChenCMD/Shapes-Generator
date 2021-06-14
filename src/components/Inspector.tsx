import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { changeParam, getArgumentMetaData, getParam, Pos, Shape } from '../types/Shape';
import PosParameterBox from './PosParameterBox';
import ParameterBox from './ParameterBox';
import styles from '../styles/Inspector.module.scss';

interface InspectorProps {
    selectedShapes: Shape[]
    setSelectedShapes: (shapes: Shape[]) => void
    shapes: Shape[]
    setShapes: (shapes: Shape[]) => void
}

const Inspector: React.FC<InspectorProps> = ({ selectedShapes, setSelectedShapes, shapes, setShapes }) => {
    const paramBoxes = selectedShapes.map(shape => (
        Object.keys(shape.arguments).map(arg => {
            const { name, description } = getArgumentMetaData(shape.type, arg);
            const updateParam = (newParam: string | Pos) => {
                const updater = (v: Shape) => v.id === shape.id ? changeParam(v, newParam, arg) : v;
                setSelectedShapes(selectedShapes.map(updater));
                setShapes(shapes.map(updater));
            };
            const param = getParam(shape, arg);
            return (
                <Col key={`${shape.id}-${arg}`} xl={3} lg={4} md={6} sm={4} xs={6} >
                    {typeof param === 'string'
                        ? (<ParameterBox name={name} description={description} updateParam={updateParam} value={param} />)
                        : (<PosParameterBox name={name} description={description} updateParam={updateParam} value={param} />)}
                </Col>
            );
        })
    )).flat();

    return (
        <div className={`${styles['inspector']} rounded`}>
            <Container fluid className={styles['inspector-param-box-container']}>
                <Row>
                    {paramBoxes}
                </Row>
            </Container>
        </div>
    );
};

export default Inspector;
