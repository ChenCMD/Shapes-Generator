import React, { useCallback, useRef, useState } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import { ShapesDispatch } from '../../reducers/shapesReducer';
import { Shape, ShapeType } from '../../ShapeNodes';
import styles from '../../styles/ParameterBox/Target.module.scss';
import { Parameter, TargetParameter, validateParam } from '../../types/Parameter';
import { UUID } from '../../types/UUID';
import { useLocale } from '../ShapesGenerator';

interface TargetParameterBoxProps {
    type: ShapeType
    arg: string
    data: Parameter<TargetParameter>
    index: number
    shapes: Shape[]
    shapesDispatch: ShapesDispatch
}

const TargetParameterBox = ({ type, arg, data, index, shapes, shapesDispatch }: TargetParameterBoxProps): JSX.Element => {
    const locale = useLocale();
    const windowRef = useRef<HTMLDivElement>(null);
    const [targetShape, setTargetShape] = useState<UUID | ''>(data.value.target);
    const [targetArg, setTargetArg] = useState<string>(data.value.target ? data.value.arg : '');
    const onChangeTargetShape = useCallback(({ target: { value: newParam } }: React.ChangeEvent<HTMLSelectElement>) => {
        setTargetShape(newParam as UUID | '');
        shapesDispatch({ type: 'update', index, arg, newParam: { target: newParam as UUID | '', arg: targetArg } });
    }, [arg, index, shapesDispatch, targetArg]);
    const onChangeTargetArg = useCallback(({ target: { value: newParam } }: React.ChangeEvent<HTMLSelectElement>) => {
        setTargetArg(newParam);
        if (validateParam(newParam, data.validation)) {
            windowRef.current?.classList.remove('error');
            shapesDispatch({ type: 'update', index, arg, newParam: { target: targetShape, arg: newParam } });
        } else {
            windowRef.current?.classList.add('error');
        }
    }, [arg, data.validation, index, shapesDispatch, targetShape]);

    const shapeList = shapes.filter((_, i) => i !== index)
        .map(v => (<option className={styles['option-shape']} key={v.uuid} value={v.uuid}>{v.name}</option>));
    const target = shapes.find(v => v.uuid === targetShape);
    const argList = target?.getManipulatableParams().filter(([v, isManipulated]) => !isManipulated || v === targetArg)
        .map(([v]) => (<option className={styles['option-arg']} key={v} value={v}>{locale(`shape.${target?.type}.${v}.name`)}</option>));
    return (
        <div ref={windowRef} className={styles['window']} title={locale(`shape.${type}.${arg}.description`)}>
            <div className={styles['name']}>{locale(`shape.${type}.${arg}.name`)}</div>
            <Container fluid className={styles['container']}>
                <Row noGutters>
                    <Col xs={6}>
                        <select className={styles['pulldown-left']} value={targetShape} onChange={onChangeTargetShape}>
                            <option className={styles['option-arg']} value={''}>-----</option>
                            {shapeList}
                        </select>
                    </Col>
                    <Col xs={6}>
                        <select className={styles['pulldown']} value={targetArg} onChange={onChangeTargetArg}>
                            <option className={styles['option-arg']} value={''}>-----</option>
                            {argList}
                        </select>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default React.memo(TargetParameterBox);
