import React, { useState, useCallback } from 'react';
import { ShapesDispatch } from '../../reducers/shapesReducer';
import { PosParameter, Parameter } from '../../types/Parameter';
import styles from '../../styles/ParameterBox/Pos.module.scss';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import { stopPropagation } from '../../utils/element';

interface PosParameterBoxProps {
    arg: string
    data: Parameter<PosParameter>
    index: number
    shapesDispatch: ShapesDispatch
}

const PosParameterBox = ({ arg, data, index, shapesDispatch }: PosParameterBoxProps): JSX.Element => {
    const [argValueX, setArgValueX] = useState<string>(data.value.x.toString());
    const [argValueY, setArgValueY] = useState<string>(data.value.y.toString());
    const checkValue = useCallback((newParam: string) => {
        if (!(/^[+,-]?(?:[1-9]\d*|0)(?:\.\d+)?$/.test(newParam)))
            return false;
        const parsedParam = parseFloat(newParam);
        if ((data.validation?.min && parsedParam < data.validation.min))
            return false;
        if (data.validation?.max && data.validation.max < parsedParam)
            return false;
        return true;
    }, [data.validation]);
    const onChangeX = useCallback(({ target: { value: newParam } }: React.ChangeEvent<HTMLInputElement>) => {
        setArgValueX(newParam);
        if (!checkValue(newParam)) return;
        shapesDispatch({ type: 'update', index, arg, newParam: { x: parseFloat(newParam), y: parseFloat(argValueY) } });
    }, [arg, argValueY, checkValue, index, shapesDispatch]);
    const onChangeY = useCallback(({ target: { value: newParam } }: React.ChangeEvent<HTMLInputElement>) => {
        setArgValueY(newParam);
        if (!checkValue(newParam)) return;
        shapesDispatch({ type: 'update', index, arg, newParam: { x: parseFloat(argValueX), y: parseFloat(newParam) } });
    }, [arg, argValueX, checkValue, index, shapesDispatch]);

    return (
        <div className={styles['window']} title={data.description}>
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
