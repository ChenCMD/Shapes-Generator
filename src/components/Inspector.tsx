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
import RangeParameterBox from './ParameterBox/Range';
import PosParameterBox from './ParameterBox/Pos';

interface InspectorProps {
    shapes: Shape[]
    shapesDispatch: ShapesDispatch
}

const Inspector = ({ shapes, shapesDispatch }: InspectorProps): JSX.Element => {
    const paramBoxes = shapes.flatMap(<T extends { [key in P]: Param }, P extends string, S extends AbstractShapeNode<T, P>>(shape: S, i: number) => {
        if (!shape.isSelected) return;
        // TODO 複数選択時の挙動
        return shape.getParameterMap().map(([arg, param]) => {
            const colWrap = (w: number, elem: JSX.Element) => (<Col key={`${shape.uuid}-${param.name}`} xl={w * 1} lg={w * 2} md={w * 3} sm={w * 2} xs={w * 3} >{elem}</Col>);
            switch (param.type) {
                case 'pos': return colWrap(4, <PosParameterBox arg={arg} data={param} index={i} shapesDispatch={shapesDispatch}/>);
                case 'range': return colWrap(4, <RangeParameterBox arg={arg} data={param} index={i} shapesDispatch={shapesDispatch} />);
                case 'normal': default: return colWrap(4, <NormalParameterBox arg={arg} data={param} index={i} shapesDispatch={shapesDispatch} />);
            }
        });
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
