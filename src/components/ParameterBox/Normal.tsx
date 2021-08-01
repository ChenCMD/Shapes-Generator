import React, { useCallback, useState, useRef } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import { locale } from '../../locales';
import { ShapesDispatch } from '../../reducers/shapesReducer';
import { ShapeType } from '../../ShapeNodes';
import styles from '../../styles/ParameterBox/Normal.module.scss';
import { NormalParameter, Parameter, validateParam } from '../../types/Parameter';
import { stopPropagation } from '../../utils/element';

interface NormalParameterBoxProps {
    type: ShapeType
    arg: string
    data: Parameter<NormalParameter>
    index: number
    shapesDispatch: ShapesDispatch
}

const NormalParameterBox = ({ type, arg, data, index, shapesDispatch }: NormalParameterBoxProps): JSX.Element => {
    const windowRef = useRef<HTMLDivElement>(null);
    const [argValue, setArgValue] = useState<string>(data.value.toString());
    const onChange = useCallback(({ target: { value: newParam } }: React.ChangeEvent<HTMLInputElement>) => {
        setArgValue(newParam);
        if (validateParam(newParam, data.validation)) {
            windowRef.current?.classList.remove('error');
            shapesDispatch({ type: 'update', index, arg, newParam: parseFloat(newParam) });
        } else {
            windowRef.current?.classList.add('error');
        }
    }, [arg, data.validation, index, shapesDispatch]);

    return (
        <div ref={windowRef} className={styles['window']} title={locale(`shape.${type}.${arg}.description`)}>
            <div className={styles['name']}>{locale(`shape.${type}.${arg}.name`)}</div>
            <Container fluid className={styles['container']}>
                <Row noGutters>
                    <Col xs={12 - (data.unit ? 2 : 0)}>
                        <input className={styles['input']} type='number' onChange={onChange} value={argValue} onKeyDown={stopPropagation} />
                    </Col>
                    {data.unit ? (<Col xs={2}><div className={styles['unit']}>{locale(data.unit)}</div></Col>) : <></>}
                </Row>
            </Container>
        </div>
    );
};

export default React.memo(NormalParameterBox);
