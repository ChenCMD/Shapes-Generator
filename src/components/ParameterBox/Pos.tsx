import React, { useCallback, useRef, useState } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import { ShapesDispatch } from '../../reducers/shapesReducer';
import styles from '../../styles/ParameterBox/Pos.module.scss';
import { Parameter, PosParameter, validateParam } from '../../types/Parameter';
import { stopPropagation } from '../../utils/element';

interface PosParameterBoxProps {
    arg: string
    data: Parameter<PosParameter>
    index: number
    shapesDispatch: ShapesDispatch
}

const PosParameterBox = ({ arg, data, index, shapesDispatch }: PosParameterBoxProps): JSX.Element => {
    const windowRef = useRef<HTMLDivElement>(null);
    const [argValueX, setArgValueX] = useState<string>(data.value.x.toString());
    const [argValueY, setArgValueY] = useState<string>(data.value.y.toString());
    const onChangeX = useCallback(({ target: { value: newParam } }: React.ChangeEvent<HTMLInputElement>) => {
        setArgValueX(newParam);
        if (validateParam(newParam, data.validation)) {
            windowRef.current?.classList.remove('error');
            shapesDispatch({ type: 'update', index, arg, newParam: { x: parseFloat(newParam), y: parseFloat(argValueY) } });
        } else {
            windowRef.current?.classList.add('error');
        }
    }, [arg, argValueY, data.validation, index, shapesDispatch]);
    const onChangeY = useCallback(({ target: { value: newParam } }: React.ChangeEvent<HTMLInputElement>) => {
        setArgValueY(newParam);
        if (validateParam(newParam, data.validation)) {
            windowRef.current?.classList.remove('error');
            shapesDispatch({ type: 'update', index, arg, newParam: { x: parseFloat(argValueX), y: parseFloat(newParam) } });
        } else {
            windowRef.current?.classList.add('error');
        }
    }, [arg, argValueX, data.validation, index, shapesDispatch]);

    return (
        <div ref={windowRef} className={styles['window']} title={data.description}>
            <div className={styles['name']}>{data.name}</div>
            <Container fluid className={styles['container']}>
                <Row noGutters>
                    <Col xs={1}><div className={styles['unit-x']}>X</div></Col>
                    <Col xs={5}>
                        <input className={styles['input']} type='number' onChange={onChangeX} value={argValueX} onKeyDown={stopPropagation} />
                    </Col>
                    <Col xs={1}><div className={styles['unit-y']}>Y</div></Col>
                    <Col xs={5}>
                        <input className={styles['input']} type='number' onChange={onChangeY} value={argValueY} onKeyDown={stopPropagation} />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default React.memo(PosParameterBox);
