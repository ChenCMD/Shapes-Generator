import React from 'react';
import { Col, Container, Row, Button, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
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
    openExportModal: (isOpen: boolean) => void;
}

const Menu: React.FC<MenuProps> = ({ gridMode, setGridMode, duplicatedPointRange, setDuplicatedPointRange, openExportModal }) => {
    const onExport = () => openExportModal(true);

    const onGridModeChange = (e: React.ChangeEvent<HTMLInputElement>) => setGridMode(parseInt(e.target.value));

    return (
        <div className={styles['menu-window']}>
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
                            spIndicateZeroVal="OFF"
                        />
                    </Col>
                </Row>
                <Row><Col><hr className={styles['line']} /></Col></Row>
                <Row className={styles['row']}>
                    <Col>
                        <Button >未実装</Button>
                    </Col>
                    <Col>
                        <Button onClick={onExport}>Export</Button>
                    </Col>
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

export default Menu;
