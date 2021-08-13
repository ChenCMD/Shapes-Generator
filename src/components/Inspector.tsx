import React from 'react';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import { ShapesDispatch } from '../reducers/shapesReducer';
import { Shape } from '../ShapeNodes';
import styles from '../styles/Inspector.module.scss';
import NormalParameterBox from './ParameterBox/Normal';
import PosParameterBox from './ParameterBox/Pos';
import RangeParameterBox from './ParameterBox/Range';
import TargetParameterBox from './ParameterBox/Target';

interface InspectorProps {
    shapes: Shape[]
    shapesDispatch: ShapesDispatch
}

const Inspector = ({ shapes, shapesDispatch }: InspectorProps): JSX.Element => {
    const paramBoxes = shapes.flatMap((shape: Shape, index: number) => {
        if (!shape.isSelected) return;
        // TODO 複数選択時の挙動
        return shape.getParameterMap().map(([arg, param]) => {
            const colWrap = (elem: JSX.Element) => (<Col key={`${shape.uuid}-${arg}`} className={styles['xxl']} xl={6} lg={12} md={4} sm={6} xs={12}>{elem}</Col>);
            const props = { type: shape.type, arg, index, shapesDispatch };
            switch (param.type) {
                case 'pos':
                    return colWrap(<PosParameterBox {...props} data={param} indexMap={shapes.map(v => v.uuid)} />);
                case 'range':
                    return colWrap(<RangeParameterBox {...props} data={param} />);
                case 'target':
                    return colWrap(<TargetParameterBox {...props} data={param} shapes={shapes} />);
                case 'normal':
                default:
                    return colWrap(<NormalParameterBox {...props} data={param} />);
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
