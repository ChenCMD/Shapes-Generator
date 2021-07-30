import React, { useCallback } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import ToggleButton from 'react-bootstrap/esm/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/esm/ToggleButtonGroup';
import styles from '../styles/Menu.module.scss';
import { GridMode } from '../types/GridMode';
import RangeSlider from './RangeSlider';

// useEffect(() => {
//     const picker = Pickr.create({
//         el: '#pickr',
//         theme: 'nano',
//         default: 'rgb(16, 16, 16)',
//         components: {
//             // Main components
//             preview: true,
//             opacity: false,
//             hue: true,
//             // Input / output Options
//             interaction: {
//                 input: true,
//                 clear: true,
//                 save: true
//             }
//         }
//     });
//     return picker.destroyAndRemove;
// }, []);

interface MenuProps {
    gridMode: GridMode
    setGridMode: (mode: GridMode) => void
    duplicatedPointRange: number
    setDuplicatedPointRange: (value: number) => void
    openImportModal: (isOpen: boolean) => void;
    openExportModal: (isOpen: boolean) => void;
}

const Menu = ({ gridMode, setGridMode, duplicatedPointRange, setDuplicatedPointRange, openImportModal, openExportModal }: MenuProps): JSX.Element => {
    const onImport = useCallback(() => openImportModal(true), [openImportModal]);
    const onExport = useCallback(() => openExportModal(true), [openExportModal]);
    const onGridModeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setGridMode(parseInt(e.target.value)), [setGridMode]);

    return (
        <div className={styles['window']}>
            <Container fluid className={styles['container']}>
                <Row className={styles['row']}>
                    <Col>
                        <div className={styles['text']}>グリッド</div>
                        <ToggleButtonGroup type="radio" name="options" defaultValue={gridMode} value={gridMode}>
                            <ToggleButton className={styles['button']} value={0} onChange={onGridModeChange}>
                                Off
                            </ToggleButton>
                            <ToggleButton className={styles['button']} value={1} onChange={onGridModeChange}>
                                Block
                            </ToggleButton>
                            <ToggleButton className={styles['button']} value={2} onChange={onGridModeChange}>
                                Double
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                </Row>
                <Row><Col><hr className={styles['line']} /></Col></Row>
                <Row className={styles['row']}>
                    <Col>
                        <div className={styles['text']}>重複点の削除</div>
                        <RangeSlider
                            min={0} step={0.05} max={0.5}
                            value={duplicatedPointRange}
                            setValue={setDuplicatedPointRange}
                            unit="m"
                            specialZeroVal="OFF"
                        />
                    </Col>
                </Row>
                <Row><Col><hr className={styles['line']} /></Col></Row>
                <Row className={styles['row']}>
                    <Col><Button onClick={onImport}>Import</Button></Col>
                    <Col><Button onClick={onExport}>Export</Button></Col>
                </Row>
                {/* <Row>
                    <Col>
                        <div className={styles['text']}>背景のカラー</div>
                        <div id="pickr"></div>
                    </Col>
                </Row> */}
                {/* <Row>
                <Col>
                    <div className={styles['text']}>点の表示のカラー/サイズ設定</div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className={styles['text']}>出力に利用するパーティクル</div>
                </Col>
            </Row> */}
            </Container>
        </div>
    );
};

export default React.memo(Menu);
