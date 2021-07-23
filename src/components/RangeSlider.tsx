import React, { useCallback } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/esm/Form';
import Row from 'react-bootstrap/esm/Row';
import styles from '../styles/RangeSlider.module.scss';
import { stopPropagation } from '../utils/element';

interface RangeSliderProps {
    min: number
    step: number
    max: number
    value: number
    setValue: (value: number) => void
    unit?: string
    spIndicateZeroVal?: string
    className?: string
    allowDirectInput?: true
    layoutOffset?: number | { xs?: number, sm?: number, md?: number, lg?: number, xl?: number, xxl?: number }
}

const RangeSlider = ({ className, min, step, value, setValue, max, unit, spIndicateZeroVal, allowDirectInput, layoutOffset }: RangeSliderProps): JSX.Element => {
    const onChange = useCallback((e: { target: { value: string } }) => setValue(parseFloat(e.target.value)), [setValue]);

    const size = React.useMemo(() => {
        if (typeof layoutOffset !== 'object') return { xs: layoutOffset ?? 0 };
        return { ...layoutOffset, xs: layoutOffset.xs ?? 0 };
    }, [layoutOffset]);

    const viewer = allowDirectInput
        ? (
            <Container fluid className={styles['container']}>
                <Row noGutters>
                    <Col xs={12 - (unit ? 4 : 0)}>
                        <input className={styles['input']} type='number' onChange={onChange} value={value} onKeyDown={stopPropagation} />
                    </Col>
                    {unit ? (<Col xs={4}><div className={styles['unit']}>{unit}</div></Col>) : <></>}
                </Row>
            </Container>
        )
        : (
            <div className={styles['value']}>
                {spIndicateZeroVal !== undefined && value === 0 ? spIndicateZeroVal : `${value}${unit ?? ''}`}
            </div>
        );

    return (
        <Container className={className}>
            <Row noGutters>
                <Col xs={2 + size.xs}
                    sm={size.sm === undefined ? undefined : (2 + size.sm)} md={size.md === undefined ? undefined : (2 + size.md)}
                    lg={size.lg === undefined ? undefined : (2 + size.lg)} xl={size.xl === undefined ? undefined : (2 + size.xl)}
                    className={size.xxl === undefined ? undefined : (styles as { [k: string]: string })[`col-xxl-${2 + size.xxl}`]}
                >
                    {viewer}
                </Col>
                <Col xs={10 - size.xs}
                    sm={size.sm === undefined ? undefined : (10 - size.sm)} md={size.md === undefined ? undefined : (10 - size.md)}
                    lg={size.lg === undefined ? undefined : (10 - size.lg)} xl={size.xl === undefined ? undefined : (10 - size.xl)}
                    className={size.xxl === undefined ? undefined : (styles as { [k: string]: string })[`col-xxl-${10 - size.xxl}`]}
                >
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
