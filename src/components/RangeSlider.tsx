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
}

const RangeSlider = ({ className, min, step, value, setValue, max, unit, spIndicateZeroVal }: RangeSliderProps): JSX.Element => {
    const onChange = useCallback((e: { target: { value: string } }) => setValue(parseFloat(e.target.value)), [setValue]);

    return (
        <Container className={className}>
            <Row>
                <Col xs={2} className={styles['col-value']}>
                    <div className={styles['value']}>
                        {
                            spIndicateZeroVal !== undefined && value === 0
                                ? spIndicateZeroVal
                                : `${value}${unit ?? ''}`
                        }
                    </div>
                </Col>
                <Col xs={10} className={styles['col-slider']}>
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
