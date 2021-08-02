import React, { useCallback, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import ToggleButton from 'react-bootstrap/esm/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/esm/ToggleButtonGroup';
import ReactModal from 'react-modal';
import useTextToClipboard from '../hooks/useTextToClipboard';
import { locale } from '../locales';
import { generateExportKey } from '../ShapeNodes';
import styles from '../styles/ExportModal.module.scss';
import { ExportObject } from '../types/ExportObject';
import { Point, ProcessedPoints } from '../types/Point';
import { round, toFracString as toStr } from '../utils/common';
import { stopPropagation } from '../utils/element';
import RangeSlider from './RangeSlider';
import { showNotification } from './ShapesGenerator';

ReactModal.setAppElement('#root');

interface ExportModalProps {
    openExportModal: (isOpen: boolean) => void
    importStrings: ExportObject[]
    points: ProcessedPoints[]
    isOpen: boolean
    duplicatedPointRange: number
    setDuplicatedPointRange: (value: number) => void
    isNotSaved: React.MutableRefObject<boolean>
}

const ExportModal = ({ openExportModal, importStrings: exportObjects, points, isOpen, duplicatedPointRange, setDuplicatedPointRange, isNotSaved }: ExportModalProps): JSX.Element => {
    const [exportAcc, setExportAcc] = useState<number>(5);
    const [hasNameComment, setHasNameComment] = useState<boolean>(true);
    const [particle, setParticle] = useState<string>('end_rod');
    const [particleSpeed, setParticleSpeed] = useState<number>(0);

    const generateExportData = useCallback(() => {
        const importStr = `# [ImportKey]: ${generateExportKey(exportObjects)}`;
        const mkCmd = (pos: Point) => `particle ${particle.trim()} ^${toStr(pos[0])} ^ ^${toStr(pos[1])} 0 0 0 ${toStr(particleSpeed)} 1`;
        return [importStr, ...points.flatMap(v => [
            ...(hasNameComment ? [`# ${v.name}`] : []),
            ...v.points.map(({ pos: [x, y] }) => mkCmd([round(x, exportAcc), round(y, exportAcc)]))
        ])].join('\n');
    }, [exportAcc, exportObjects, hasNameComment, particle, particleSpeed, points]);

    const onExportToMcf = useCallback(() => {
        isNotSaved.current = false;
        const blob = new File([generateExportData()], 'particle.mcfunction', { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = 'particle.mcfunction';
        a.click();
    }, [isNotSaved, generateExportData]);

    const textToClipboard = useTextToClipboard();
    const onExportToClipboard = useCallback(() => {
        isNotSaved.current = false;
        textToClipboard(generateExportData());
        showNotification('success', 'copy success!');
    }, [isNotSaved, generateExportData, textToClipboard]);

    const onRequestClose = useCallback(() => openExportModal(false), [openExportModal]);
    const onChangeParticle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setParticle(e.target.value), []);
    const onChangeHasNameComment = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setHasNameComment(e.target.value === 'true'), []);

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
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
        >
            <Container fluid className={styles['container']}>
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
                        <div className={styles['text']}>{locale('delete-duplicate-points')}</div>
                        <RangeSlider
                            min={0} step={0.05} max={0.5}
                            value={duplicatedPointRange}
                            setValue={setDuplicatedPointRange}
                            unit="m"
                            specialZeroVal={locale('off')}
                        />
                    </Col>
                </Row>
                <Row><Col><hr className={styles['line']} /></Col></Row>
                <Row noGutters>
                    <Col className={styles['col']}>
                        <div className={styles['text']}>
                            {locale('export.export-', locale('particle-amount'))}: {points.reduce((s, v) => s + v.points.length, 0)}
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
