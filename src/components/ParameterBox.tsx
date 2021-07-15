import React, { useState, useCallback } from 'react';
import { ShapesDispatch } from '../reducers/shapesReducer';
import styles from '../styles/ParameterBox.module.scss';
import { Parameter } from '../types/AbstractShapeNode';

interface ParameterBoxProps<T extends string> {
    data: Parameter<T>
    index: number
    shapesDispatch: ShapesDispatch
}

const ParameterBox = <T extends string>({ data, index, shapesDispatch }: ParameterBoxProps<T>): JSX.Element => {
    const [argValue, setArgValue] = useState(data.value);
    const onChange = useCallback(({ target: { value: newParam } }: React.ChangeEvent<HTMLInputElement>) => {
        setArgValue(newParam);
        if (!(/^[+,-]?(?:[1-9]\d*|0)(?:\.\d+)?$/.test(newParam))) return;
        shapesDispatch({ type: 'update', index, arg: data.argID, newParam });
    }, [data.argID, data.validation, index, shapesDispatch]);

    return (
        <div className={styles['param-box']} title={data.description}>
            <div className={styles['param-box-name']}>{data.name}</div>
            <input className={styles['param-box-input']} type='number' onChange={onChange} value={argValue} />
        </div>
    );
};

export default React.memo(ParameterBox);
