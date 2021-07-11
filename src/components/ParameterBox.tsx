import React, { useState } from 'react';
import styles from '../styles/ParameterBox.module.scss';

interface ParameterBoxProps {
    name: string
    description: string
    updateParam: (newParam: string) => void
    value: string
}

const ParameterBox: React.FC<ParameterBoxProps> = ({ name, description, updateParam, value }) => {
    const [argValue, setArgValue] = useState(value);
    const onChange = ({ target: { value: newValue } }: React.ChangeEvent<HTMLInputElement>) => {
        setArgValue(newValue);
        if (!(/^[+,-]?(?:[1-9]\d*|0)(?:\.\d+)?$/.test(newValue))) return;
        updateParam(newValue);
    };

    return (
        <div className={styles['param-box']} title={description}>
            <div className={styles['param-box-name']}>{name}</div>
            <input className={styles['param-box-input']} type='number' onChange={onChange} value={argValue} />
        </div>
    );
};

export default ParameterBox;
