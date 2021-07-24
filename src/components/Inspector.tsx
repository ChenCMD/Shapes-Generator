import React from 'react';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import { ShapesDispatch } from '../reducers/shapesReducer';
import { Shape } from '../ShapeNodes';
import styles from '../styles/Inspector.module.scss';
import { AbstractShapeNode } from '../types/AbstractShapeNode';
import { Param } from '../types/Parameter';
import NormalParameterBox from './ParameterBox/Normal';
import PosParameterBox from './ParameterBox/Pos';
import RangeParameterBox from './ParameterBox/Range';

interface InspectorProps {
    shapes: Shape[]
    shapesDispatch: ShapesDispatch
}

const Inspector = ({ shapes, shapesDispatch }: InspectorProps): JSX.Element => {
    const paramBoxes = shapes.flatMap(<T extends { [key in P]: Param }, P extends string, S extends AbstractShapeNode<T, P>>(shape: S, i: number) => {
        if (!shape.isSelected) return;
        // TODO 複数選択時の挙動
        return shape.getParameterMap().map(([arg, param]) => {
            const colWrap = (elem: JSX.Element) => (<Col key={`${shape.uuid}-${param.name}`} className={styles['xxl']} xl={6} lg={12} md={4} sm={6} xs={12}>{elem}</Col>);
            switch (param.type) {
                case 'pos': return colWrap(<PosParameterBox arg={arg} data={param} index={i} shapesDispatch={shapesDispatch}/>);
                case 'range': return colWrap(<RangeParameterBox arg={arg} data={param} index={i} shapesDispatch={shapesDispatch} />);
                case 'normal': default: return colWrap(<NormalParameterBox arg={arg} data={param} index={i} shapesDispatch={shapesDispatch} />);
            }
        });
    }).filter(v => v !== undefined) as JSX.Element[];

    return (
        <div className={styles['window']}>
            <Container fluid className={styles['container']}>
                <Row>
                    {paramBoxes}
                </Row>
            </Container>
        </div>
    );
};

export default React.memo(Inspector);
