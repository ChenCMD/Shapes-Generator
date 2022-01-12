import React, { useCallback, useMemo, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import ToggleButton from 'react-bootstrap/esm/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/esm/ToggleButtonGroup';
import ReactModal from 'react-modal';
import useTextToClipboard from '../hooks/useTextToClipboard';
import { generateExportKey, Shape } from '../ShapeNodes';
import styles from '../styles/ExportModal.module.scss';
import { calcPoint, Point, ProcessedPoints } from '../types/Point';
import { StateDispatcher } from '../types/StateDispatcher';
import { toFracString as toStr } from '../utils/common';
import { stopPropagation } from '../utils/element';
import { round } from '../utils/math';
import OptimizeParticleSetting from './OptimizeParticleSetting';
import RangeSlider from './RangeSlider';
import { showNotification, useLocale } from './ShapesGenerator';

ReactModal.setAppElement('#root');

interface ExportModalProps {
    setExportModalOpened: StateDispatcher<boolean>
    shapes: Shape[]
    points: ProcessedPoints[]
    isOpen: boolean
    duplicatedPointRange: number
    setDuplicatedPointRange: StateDispatcher<number>
    isSaved: React.MutableRefObject<boolean>
}

const ExportModal = ({ setExportModalOpened, shapes, points, isOpen, duplicatedPointRange, setDuplicatedPointRange, isSaved }: ExportModalProps): JSX.Element => {
    const locale = useLocale();
    const [exportAcc, setExportAcc] = useState<number>(5);
    const [hasNameComment, setHasNameComment] = useState<boolean>(true);
    const [isCustomCommandMode, setCustomCommandMode] = useState<boolean>(false);
    // eslint-disable-next-line no-template-curly-in-string
    const [customCommand, setCustomCommand] = useState<string>('setblock ^${x} ^ ^${y} glass');
    const [particle, setParticle] = useState<string>('end_rod');
    const [particleSpeed, setParticleSpeed] = useState<number>(0);

    const particleAmount = useMemo(() => points.reduce((s, v) => s + v.points.length, 0), [points]);

    const generateExportData = useCallback(() => {
        const mkCmd = (pos: Point) => isCustomCommandMode
            ? customCommand.replace(/\$\{x\}/g, toStr(pos.x)).replace(/\$\{y\}/g, toStr(pos.y))
            : `particle ${particle.trim()} ^${toStr(pos.x)} ^ ^${toStr(pos.y)} 0 0 0 ${toStr(particleSpeed)} 1`;
        return [
            `# [ImportKey]: ${generateExportKey(shapes)}`,
            ...points.flatMap(v => [
                ...(hasNameComment ? [`# ${v.name}`] : []),
                ...v.points.map(point => mkCmd(calcPoint(point, p => round(p, exportAcc))))
            ])
        ].join('\n');
    }, [customCommand, exportAcc, shapes, hasNameComment, isCustomCommandMode, particle, particleSpeed, points]);

    const onExportToMcf = useCallback(() => {
        isSaved.current = true;
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(new File([generateExportData()], 'particle.mcfunction', { type: 'text/plain' }));
        a.download = 'particle.mcfunction';
        a.click();
    }, [isSaved, generateExportData]);

    const textToClipboard = useTextToClipboard();
    const onExportToClipboard = useCallback(() => {
        isSaved.current = true;
        textToClipboard(generateExportData());
        showNotification('success', 'copy success!');
    }, [isSaved, generateExportData, textToClipboard]);

    const onRequestClose = useCallback(() => setExportModalOpened(false), [setExportModalOpened]);
    const onChangeCommandMode = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setCustomCommandMode(e.target.value === 'true'), []);
    const onChangeCustomCommand = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setCustomCommand(e.target.value), []);
    const onChangeParticle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setParticle(e.target.value), []);
    const onChangeHasNameComment = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setHasNameComment(e.target.value === 'true'), []);

    const customCommandElement = (
        <Row noGutters>
            <Col className={styles['col']}>
                <input className={styles['input']}
                    onChange={onChangeCustomCommand}
                    value={customCommand} onKeyDown={stopPropagation}
                />
            </Col>
        </Row>
    );
    const particleSettingElement = <>
        <Row><Col><hr className={styles['line']} /></Col></Row>
        <Row noGutters>
            <Col className={styles['col']}>
                <div className={styles['text']}>{locale('export.particle')}</div>
                <input className={styles['input']}
                    onChange={onChangeParticle}
                    value={particle} onKeyDown={stopPropagation}
                />
            </Col>
        </Row>
        <Row><Col><hr className={styles['line']} /></Col></Row>
        <Row noGutters>
            <Col className={styles['col']}>
                <div className={styles['text']}>{locale('export.particle-speed')}</div>
                <RangeSlider
                    min={0} step={0.01} max={1}
                    value={particleSpeed}
                    setValue={setParticleSpeed}
                />
            </Col>
        </Row>
    </>;
    return (
        <ReactModal
            overlayClassName={{
                base: styles['overlay'],
                afterOpen: styles['after'],
                beforeClose: styles['before']
            }}
            className={{
                base: styles['content'],
                afterOpen: styles['after'],
                beforeClose: styles['before']
            }}
            {...{ isOpen, onRequestClose }}
        >
            <Container fluid className={styles['container']}>
                <Row noGutters>
                    <Col className={styles['col']}>
                        <div className={styles['text']}>{locale('export.command-mode')}</div>
                        <ToggleButtonGroup type="radio" name="options" defaultValue={isCustomCommandMode.toString()} value={isCustomCommandMode.toString()}>
                            <ToggleButton className={styles['button']} value={'false'} onChange={onChangeCommandMode}>
                                {locale('off')}
                            </ToggleButton>
                            <ToggleButton className={styles['button']} value={'true'} onChange={onChangeCommandMode}>
                                {locale('on')}
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                </Row>
                {isCustomCommandMode ? customCommandElement : particleSettingElement}
                <Row><Col><hr className={styles['line']} /></Col></Row>
                <Row noGutters>
                    <Col className={styles['col']}>
                        <div className={styles['text']}>{locale('export.separate-export-data')}</div>
                        <ToggleButtonGroup type="radio" name="options" defaultValue={hasNameComment.toString()} value={hasNameComment.toString()}>
                            <ToggleButton className={styles['button']} value={'false'} onChange={onChangeHasNameComment}>
                                {locale('off')}
                            </ToggleButton>
                            <ToggleButton className={styles['button']} value={'true'} onChange={onChangeHasNameComment}>
                                {locale('on')}
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                </Row>
                <Row><Col><hr className={styles['line']} /></Col></Row>
                <Row noGutters>
                    <Col className={styles['col']}>
                        <div className={styles['text']}>{locale('export.coordinate-accuracy')}</div>
                        <RangeSlider
                            min={1} step={1} max={5}
                            value={exportAcc}
                            setValue={setExportAcc}
                            unit={locale('digit')}
                        />
                    </Col>
                </Row>
                <Row><Col><hr className={styles['line']} /></Col></Row>
                <Row noGutters>
                    <Col className={styles['col']}>
                        <OptimizeParticleSetting {...{ duplicatedPointRange, setDuplicatedPointRange }} />
                    </Col>
                </Row>
                <Row><Col><hr className={styles['line']} /></Col></Row>
                <Row noGutters>
                    <Col className={styles['col']}>
                        <div className={styles['text']}>
                            {locale('export.export-particle-amount')}: {particleAmount}
                        </div>
                    </Col>
                </Row>
                <Row><Col><hr className={styles['line']} /></Col></Row>
                <Row noGutters>
                    <Col className={styles['col']} xl={4} lg={4} md={6} sm={6} xs={12}>
                        <Button onClick={onRequestClose}>{locale('cancel')}</Button>
                    </Col>
                    <Col className={styles['col']} xl={4} lg={4} md={6} sm={6} xs={12}>
                        <Button onClick={onExportToMcf}>{locale('export.to-mcfunction')}</Button>
                    </Col>
                    <Col className={styles['col']} xl={4} lg={4} md={6} sm={6} xs={12}>
                        <Button onClick={onExportToClipboard}>{locale('export.to-clipboard')}</Button>
                    </Col>
                </Row>
            </Container>
        </ReactModal>
    );
};

export default React.memo(ExportModal);
