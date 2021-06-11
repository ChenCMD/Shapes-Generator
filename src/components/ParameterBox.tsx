import React, { useState } from 'react';

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
        updateParam(newValue);
    };

    return (
        <div className="inspector-param-box" title={description}>
            <div className="inspector-param-box-name">{name}</div>
            <input className="inspector-param-box-input" onChange={e => onChange(e.target.value)} value={argValue} />
        </div>
    );
};

export default ParameterBox;