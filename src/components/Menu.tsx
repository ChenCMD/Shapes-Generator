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
    generateExportFile: () => string
}

const Menu: React.FC<MenuProps> = ({ gridMode, setGridMode, duplicatedPointRange, setDuplicatedPointRange, generateExportFile }) => {
    const onExport = () => {
        console.log('onExport');
        const blob = new File([generateExportFile()], 'particle.mcfunction', { type: 'text/plain', endings: 'transparent' });
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = 'particle.mcfunction';
        a.click();
    };

    return (
        <div className={`${styles['menu-window']} rounded`}>
            <Container fluid className={styles['container']}>
                <Row className={styles['row']}>
                    <Col>
                        <Button className={styles['button']}>未実装</Button>
                    </Col>
                    <Col>
                        <Button className={styles['button']} onClick={onExport}>Export</Button>
                    </Col>
                </Row>
                <hr className={styles['line']} />
                <Row className={styles['row']}>
                    <Col>
                        <div className={styles['text']}>グリッド</div>
                        <ToggleButtonGroup type="radio" name="options" defaultValue={gridMode} value={gridMode}>
                            <ToggleButton value={1} className={styles['button']} onChange={() => setGridMode(GridMode.off)}>
                                Off
                            </ToggleButton>
                            <ToggleButton value={2} className={styles['button']} onChange={() => setGridMode(GridMode.center)}>
                                Corner
                            </ToggleButton>
                            <ToggleButton value={3} className={styles['button']} onChange={() => setGridMode(GridMode.corner)}>
                                Center
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                </Row>
                <hr className={styles['line']} />
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
                <hr className={styles['line']} />
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
