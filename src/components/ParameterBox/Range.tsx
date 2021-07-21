import React, { useState, useCallback } from 'react';
import { ShapesDispatch } from '../../reducers/shapesReducer';
import { RangeParameter, Parameter } from '../../types/Parameter';
import styles from '../../styles/ParameterBox/Range.module.scss';
import RangeSlider from '../RangeSlider';

interface RangeParameterBoxProps {
    arg: string
    data: Parameter<RangeParameter>
    index: number
    shapesDispatch: ShapesDispatch
}

const RangeParameterBox = ({ arg, data, index, shapesDispatch }: RangeParameterBoxProps): JSX.Element => {
    const [argValue, setArgValue] = useState<number>(data.value);
    const onChange = useCallback((newParam: number) => {
        setArgValue(newParam);
        if ((data.validation?.min && newParam < data.validation.min))
            return;
        if (data.validation?.max && data.validation.max < newParam)
            return;
        shapesDispatch({ type: 'update', index, arg, newParam: newParam });
    }, [arg, data.validation, index, shapesDispatch]);

    return (
        <div className={styles['param-box']} title={data.description}>
            <div className={styles['param-box-name']}>{data.name}</div>
            <RangeSlider className={styles['slider']} hasSplitLine
                min={data.min} max={data.max} step={data.step}
                value={argValue} setValue={onChange} unit={data.unit}
                layoutOffset={1}
            />
        </div>
    );
};

export default React.memo(RangeParameterBox);
