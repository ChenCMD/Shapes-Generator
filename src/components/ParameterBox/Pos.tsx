import React, { useCallback, useRef, useState } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import { locale } from '../../locales';
import { ShapesDispatch } from '../../reducers/shapesReducer';
import { ShapeType } from '../../ShapeNodes';
import styles from '../../styles/ParameterBox/Pos.module.scss';
import { getPosParameterValue, Parameter, PosParameter, validateParam } from '../../types/Parameter';
import { stopPropagation } from '../../utils/element';

interface PosParameterBoxProps {
    type: ShapeType
    arg: string
    data: Parameter<PosParameter>
    index: number
    shapesDispatch: ShapesDispatch
}

const PosParameterBox = ({ type, arg, data, index, shapesDispatch }: PosParameterBoxProps): JSX.Element => {
    const windowRef = useRef<HTMLDivElement>(null);
    const { x: valueX, y: valueY } = getPosParameterValue(data);
    const [argValueX, setArgValueX] = useState<string>(valueX);
    const [argValueY, setArgValueY] = useState<string>(valueY);
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
        <div ref={windowRef} className={styles['window']} title={locale(`shape.${type}.${arg}.description`)}>
            <div className={styles['name']}>{locale(`shape.${type}.${arg}.name`)}</div>
            <Container fluid className={styles['container']}>
                <Row noGutters>
                    <Col xs={1}><div className={styles['unit-x']}>X</div></Col>
                    <Col xs={5}>{
                        valueX !== 'manipulated' ? (
                            <input className={styles['input']}
                                type='number' onChange={onChangeX}
                                value={argValueX} onKeyDown={stopPropagation}
                            />
                        ) : (
                            <div className={styles['input']}>{locale('manipulated')}</div>
                        )
                    }</Col>
                    <Col xs={1}><div className={styles['unit-y']}>Y</div></Col>
                    <Col xs={5}>{
                        valueX !== 'manipulated' ? (
                            <input className={styles['input']}
                                type='number' onChange={onChangeY}
                                value={argValueY} onKeyDown={stopPropagation}
                            />
                        ) : (
                            <div className={styles['input']}>{locale('manipulated')}</div>
                        )
                    }</Col>
                </Row>
            </Container>
        </div>
    );
};

export default React.memo(PosParameterBox);
