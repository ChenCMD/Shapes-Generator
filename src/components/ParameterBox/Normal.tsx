import React, { useState, useCallback } from 'react';
import { ShapesDispatch } from '../../reducers/shapesReducer';
import { NormalParameter, Parameter } from '../../types/Parameter';
import styles from '../../styles/ParameterBox/Normal.module.scss';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';

interface NormalParameterBoxProps {
    arg: string
    data: Parameter<NormalParameter>
    index: number
    shapesDispatch: ShapesDispatch
}

const NormalParameterBox = ({ arg, data, index, shapesDispatch }: NormalParameterBoxProps): JSX.Element => {
    const [argValue, setArgValue] = useState<string>(data.value.toString());
    const onChange = useCallback(({ target: { value: newParam } }: React.ChangeEvent<HTMLInputElement>) => {
        setArgValue(newParam);
        if (!(/^[+,-]?(?:[1-9]\d*|0)(?:\.\d+)?$/.test(newParam)))
            return;
        const parsedParam = parseFloat(newParam);
        if ((data.validation?.min && parsedParam < data.validation.min))
            return;
        if (data.validation?.max && data.validation.max < parsedParam)
            return;
        shapesDispatch({ type: 'update', index, arg, newParam: parsedParam });
    }, [arg, data.validation, index, shapesDispatch]);

    return (
        <div className={styles['param-box']} title={data.description}>
            <div className={styles['param-box-name']}>{data.name}</div>
            <Container fluid className={styles['container']}>
                <Row noGutters>
                    <Col xs={12 - (data.unit ? 2 : 0)}>
                        <input className={styles['param-box-input']} type='number' onChange={onChange} value={argValue} />
                    </Col>
                    {data.unit ? (<Col xs={2}><div className={styles['unit']}>{data.unit}</div></Col>) : <></>}
                </Row>
            </Container>
        </div>
    );
};

export default React.memo(NormalParameterBox);
