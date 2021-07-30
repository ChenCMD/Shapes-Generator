import React, { useCallback, useState, useRef } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import { ShapesDispatch } from '../../reducers/shapesReducer';
import styles from '../../styles/ParameterBox/Normal.module.scss';
import { NormalParameter, Parameter, validateParam } from '../../types/Parameter';
import { stopPropagation } from '../../utils/element';

interface NormalParameterBoxProps {
    arg: string
    data: Parameter<NormalParameter>
    index: number
    shapesDispatch: ShapesDispatch
}

const NormalParameterBox = ({ arg, data, index, shapesDispatch }: NormalParameterBoxProps): JSX.Element => {
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
        <div ref={windowRef} className={styles['window']} title={data.description}>
            <div className={styles['name']}>{data.name}</div>
            <Container fluid className={styles['container']}>
                <Row noGutters>
                    <Col xs={12 - (data.unit ? 2 : 0)}>
                        <input className={styles['input']} type='number' onChange={onChange} value={argValue} onKeyDown={stopPropagation} />
                    </Col>
                    {data.unit ? (<Col xs={2}><div className={styles['unit']}>{data.unit}</div></Col>) : <></>}
                </Row>
            </Container>
        </div>
    );
};

export default React.memo(NormalParameterBox);
