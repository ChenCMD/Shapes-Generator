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
    const onChange = (newValue: string) => {
        setArgValue(newValue);
        if (newValue === '' || Number.isNaN(newValue)) return;
        updateParam(newValue);
    };

    return (
        <div className={`${styles['param-box']} rounded`} title={description}>
            <div className={styles['param-box-name']}>{name}</div>
            <input className={`${styles['param-box-input']} rounded`} onChange={e => onChange(e.target.value)} value={argValue} />
        </div>
    );
};

export default ParameterBox;