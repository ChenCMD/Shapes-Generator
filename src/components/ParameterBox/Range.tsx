import React, { useCallback, useRef, useState } from 'react';
import { ShapesDispatch } from '../../reducers/shapesReducer';
import styles from '../../styles/ParameterBox/Range.module.scss';
import { Parameter, RangeParameter, validateParam } from '../../types/Parameter';
import RangeSlider from '../RangeSlider';

interface RangeParameterBoxProps {
    arg: string
    data: Parameter<RangeParameter>
    index: number
    shapesDispatch: ShapesDispatch
}

const RangeParameterBox = ({ arg, data, index, shapesDispatch }: RangeParameterBoxProps): JSX.Element => {
    const windowRef = useRef<HTMLDivElement>(null);
    const [argValue, setArgValue] = useState<number>(data.value);
    const onChange = useCallback((newParam: number) => {
        setArgValue(newParam);
        if (validateParam(newParam, data.validation)) {
            windowRef.current?.classList.remove('error');
            shapesDispatch({ type: 'update', index, arg, newParam });
        } else {
            windowRef.current?.classList.add('error');
        }
    }, [arg, data.validation, index, shapesDispatch]);

    return (
        <div ref={windowRef} className={styles['window']} title={data.description}>
            <div className={styles['name']}>{data.name}</div>
            <RangeSlider className={styles['slider']} allowDirectInput
                min={data.min} max={data.max} step={data.step}
                value={argValue} setValue={onChange} unit={data.unit}
                layoutOffset={{ xs: 2, lg: 0, xl: 2, xxl: 3 }}
            />
        </div>
    );
};

export default React.memo(RangeParameterBox);
