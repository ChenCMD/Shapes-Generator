import React, { useCallback } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/esm/Form';
import Row from 'react-bootstrap/esm/Row';
import styles from '../styles/RangeSlider.module.scss';

interface RangeSliderProps {
    min: number
    step: number
    max: number
    value: number
    setValue: (value: number) => void
    unit?: string
    spIndicateZeroVal?: string
    className?: string
    hasSplitLine?: true
    layoutOffset?: number
}

const RangeSlider = ({ className, min, step, value, setValue, max, unit, spIndicateZeroVal, hasSplitLine, layoutOffset }: RangeSliderProps): JSX.Element => {
    const onChange = useCallback((e: { target: { value: string } }) => setValue(parseFloat(e.target.value)), [setValue]);

    return (
        <Container className={className}>
            <Row noGutters>
                <Col xs={2 + (layoutOffset ?? 0)}>
                    <div className={`${styles['value']} ${hasSplitLine ? styles['split-line'] : ''}`}>
                        {
                            spIndicateZeroVal !== undefined && value === 0
                                ? spIndicateZeroVal
                                : `${value}${unit ?? ''}`
                        }
                    </div>
                </Col>
                <Col xs={10 - (layoutOffset ?? 0)}>
                    <Form.Control
                        className={styles['slider']}
                        type="range"
                        value={value.toString()}
                        onChange={onChange}
                        min={min.toString()}
                        max={max.toString()}
                        step={step.toString()}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default React.memo(RangeSlider);
