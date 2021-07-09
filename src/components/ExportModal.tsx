import React, { useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import ReactModal from 'react-modal';
import styles from '../styles/ExportModal.module.scss';
import { Point } from '../types/Point';
import { round, toFracString as toStr } from '../utils/common';
import RangeSlider from './RangeSlider';

ReactModal.setAppElement('#root');

interface ExportModalProps {
    onCloseRequest: () => void
    points: Point[]
    isOpen: boolean
    duplicatedPointRange: number
    setDuplicatedPointRange: (value: number) => void
}

const ExportModal: React.FC<ExportModalProps> = ({ onCloseRequest, points, isOpen, duplicatedPointRange, setDuplicatedPointRange }) => {
    const [exportAcc, setExportAcc] = useState<number>(5);
    const [particle, setParticle] = useState<string>('end_rod');
    const [particleSpeed, setParticleSpeed] = useState<number>(0);

    const onExport = () => {
        const mkCmd = (pos: Point) => `particle ${particle.trim()} ^${toStr(pos[0])} ^ ^${toStr(pos[1])} 0 0 0 ${toStr(particleSpeed)} 1`;
        const content = points.map(([x, y]) => mkCmd([round(x, exportAcc), round(y, exportAcc)])).join('\n');

        const blob = new File([content], 'particle.mcfunction', { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = 'particle.mcfunction';
        a.click();
    };

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onCloseRequest}
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
                        <div className={styles['text']}>Particle</div>
                        <input className={styles['input']} onChange={e => setParticle(e.target.value)} value={particle} />
                    </Col>
                </Row>
                <Row><Col><hr className={styles['line']} /></Col></Row>
                <Row noGutters>
                    <Col className={styles['col']}>
                        <div className={styles['text']}>Particle: Speed</div>
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
                        <div className={styles['text']}>出力の精度</div>
                        <RangeSlider
                            min={1} step={1} max={5}
                            value={exportAcc}
                            setValue={setExportAcc}
                            unit="桁"
                        />
                    </Col>
                </Row>
                <Row><Col><hr className={styles['line']} /></Col></Row>
                <Row noGutters>
                    <Col className={styles['col']}>
                        <div className={styles['text']}>重複点の削除</div>
                        <RangeSlider
                            min={0} step={0.05} max={0.5}
                            value={duplicatedPointRange}
                            setValue={setDuplicatedPointRange}
                            unit="m"
                            spIndicateZeroVal="OFF"
                        />
                    </Col>
                </Row>
                <Row><Col><hr className={styles['line']} /></Col></Row>
                <Row noGutters>
                    <Col className={styles['col']}>
                        <div className={styles['text']}>出力されるParticle数: {points.length}</div>
                    </Col>
                </Row>
                <Row><Col><hr className={styles['line']} /></Col></Row>
                <Row noGutters>
                    <Col className={styles['col']} xl={6} lg={6} md={6} sm={12} xs={12}>
                        <Button className={styles['button']} onClick={onCloseRequest}>Close</Button>
                    </Col>
                    <Col className={styles['col']} xl={6} lg={6} md={6} sm={12} xs={12}>
                        <Button className={styles['button']} onClick={onExport}>Export</Button>
                    </Col>
                </Row>
            </Container>
        </ReactModal>
    );
};

export default ExportModal;
