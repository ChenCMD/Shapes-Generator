import React, { useCallback, useRef, useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import ToggleButton from 'react-bootstrap/esm/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/esm/ToggleButtonGroup';
import { locale } from '../../locales';
import { ShapesDispatch } from '../../reducers/shapesReducer';
import { ShapeType } from '../../ShapeNodes';
import styles from '../../styles/ParameterBox/Bool.module.scss';
import { Parameter, BoolParameter } from '../../types/Parameter';

interface BoolParameterBoxProps {
    type: ShapeType
    arg: string
    data: Parameter<BoolParameter>
    index: number
    shapesDispatch: ShapesDispatch
}

const BoolParameterBox = ({ type, arg, data, index, shapesDispatch }: BoolParameterBoxProps): JSX.Element => {
    const windowRef = useRef<HTMLDivElement>(null);
    const [argValue, setArgValue] = useState<boolean>(data.value);
    const onChange = useCallback(({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        const newParam = value === 'true';
        setArgValue(newParam);
        shapesDispatch({ type: 'update', index, arg, newParam });
    }, [arg, index, shapesDispatch]);

    return (
        <div ref={windowRef} className={styles['window']} title={locale(`shape.${type}.${arg}.description`)}>
            <div className={styles['name']}>{locale(`shape.${type}.${arg}.name`)}</div>
            <Container fluid className={styles['container']}>
                <ToggleButtonGroup className={styles['group']} type="radio" name="options" defaultValue={argValue.toString()} value={argValue.toString()}>
                <ToggleButton className={styles['button-left']} value={'false'} onChange={onChange}>
                    {locale('off')}
                </ToggleButton>
                <ToggleButton className={styles['button']} value={'true'} onChange={onChange}>
                    {locale('on')}
                </ToggleButton>
            </ToggleButtonGroup>
            </Container>
        </div>
    );
};

export default React.memo(BoolParameterBox);
