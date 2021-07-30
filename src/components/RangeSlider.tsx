import React, { useCallback } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/esm/Form';
import Row from 'react-bootstrap/esm/Row';
import styles from '../styles/RangeSlider.module.scss';
import { reverseObjProperty } from '../utils/common';
import { stopPropagation } from '../utils/element';

interface Offset { xs?: number, sm?: number, md?: number, lg?: number, xl?: number, xxl?: number }
const colWrap = (base: number, offset: Offset & { xs: number }, child: JSX.Element) => (
    <Col xs={base + offset.xs}
        sm={offset.sm === undefined ? undefined : (base + offset.sm)} md={offset.md === undefined ? undefined : (base + offset.md)}
        lg={offset.lg === undefined ? undefined : (base + offset.lg)} xl={offset.xl === undefined ? undefined : (base + offset.xl)}
        className={offset.xxl === undefined ? undefined : (styles as { [k: string]: string })[`col-xxl-${base + offset.xxl}`]}
    >
        {child}
    </Col>
);

interface RangeSliderProps {
    min: number
    step: number
    max: number
    value: number
    setValue: (value: number) => void
    unit?: string
    specialZeroVal?: string
    className?: string
    allowDirectInput?: true
    layoutOffset?: number | Offset
}

const RangeSlider = ({ className, min, step, value, setValue, max, unit, specialZeroVal, allowDirectInput, layoutOffset }: RangeSliderProps): JSX.Element => {
    const onChange = useCallback((e: { target: { value: string } }) => setValue(parseFloat(e.target.value)), [setValue]);

    const size = React.useMemo(() => {
        if (typeof layoutOffset !== 'object') return { xs: layoutOffset ?? 0 };
        return { ...layoutOffset, xs: layoutOffset.xs ?? 0 };
    }, [layoutOffset]);

    const viewer = allowDirectInput
        ? (<Container fluid className={styles['container']}>
            <Row noGutters>
                <Col xs={12 - (unit ? 4 : 0)}>
                    <input className={styles['input']} type='number' onChange={onChange} value={value} onKeyDown={stopPropagation} />
                </Col>
                {unit ? (<Col xs={4}><div className={styles['unit']}>{unit}</div></Col>) : <></>}
            </Row>
        </Container>)
        : (<div className={styles['value']}>{specialZeroVal !== undefined && value === 0 ? specialZeroVal : `${value}${unit ?? ''}`}</div>);

    return (
        <Container className={className}>
            <Row noGutters>
                {colWrap(2, size, viewer)}
                {colWrap(10, reverseObjProperty(size), (
                    <Form.Control
                        className={styles['slider']}
                        type="range"
                        value={value.toString()}
                        onChange={onChange}
                        min={min.toString()}
                        max={max.toString()}
                        step={step.toString()}
                    />
                ))}
            </Row>
        </Container>
    );
};

export default React.memo(RangeSlider);
