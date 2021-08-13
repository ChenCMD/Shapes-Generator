import React, { useCallback, useRef, useState } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import { locale } from '../../locales';
import { ShapesDispatch } from '../../reducers/shapesReducer';
import { ShapeType } from '../../ShapeNodes';
import styles from '../../styles/ParameterBox/Pos.module.scss';
import { getPosParameterValue, Parameter, PosParameter, validateParam } from '../../types/Parameter';
import { UUID } from '../../types/UUID';
import { stopPropagation } from '../../utils/element';

interface PosParameterBoxProps {
    type: ShapeType
    arg: string
    data: Parameter<PosParameter>
    index: number
    indexMap: UUID[]
    shapesDispatch: ShapesDispatch
}

const PosParameterBox = ({ type, arg, data, index, indexMap, shapesDispatch }: PosParameterBoxProps): JSX.Element => {
    const windowRef = useRef<HTMLDivElement>(null);
    const { x: valueX, y: valueY } = getPosParameterValue(data);
    const [argValueX, setArgValueX] = useState<string>(valueX);
    const [argValueY, setArgValueY] = useState<string>(valueY);

    const onClickManipulateNotice = useCallback(() => {
        if (!data.manipulatable || !data.value.manipulate) return;
        const val = data.value;
        if (!val.manipulate) return;
        const targetIdx = indexMap.indexOf(val.from);
        if (targetIdx === -1) return;
        shapesDispatch({ type: 'select', index: targetIdx, isRetentionOld: false });
    }, [data, indexMap, shapesDispatch]);

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

    const isManipulated = valueX === 'manipulated';
    const whenManipulated = <T, U>(a: T, b: U) => isManipulated ? a : b;
    const inputProps = {
        className: styles[whenManipulated('input-manipulated', 'input')],
        onClick: whenManipulated(onClickManipulateNotice, undefined),
        onKeyDown: stopPropagation,
        readOnly: isManipulated,
        type: whenManipulated(undefined, 'number')
    };
    return (
        <div ref={windowRef} className={styles['window']} title={locale(`shape.${type}.${arg}.description`)}>
            <div className={styles['name']}>{locale(`shape.${type}.${arg}.name`)}</div>
            <Container fluid className={styles['container']}>
                <Row noGutters>
                    <Col xs={1}><div className={styles['unit-x']}>X</div></Col>
                    <Col xs={5}>
                        <input {...inputProps} onChange={onChangeX} value={whenManipulated(locale('manipulated'), argValueX)} />
                    </Col>
                    <Col xs={1}><div className={styles['unit-y']}>Y</div></Col>
                    <Col xs={5}>
                        <input {...inputProps} onChange={onChangeY} value={whenManipulated(locale('manipulated'), argValueY)} />
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default React.memo(PosParameterBox);
