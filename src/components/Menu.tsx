import React, { useCallback } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Form from 'react-bootstrap/esm/Form';
import Row from 'react-bootstrap/esm/Row';
import ToggleButton from 'react-bootstrap/esm/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/esm/ToggleButtonGroup';
import { languageMap } from '../locales';
import styles from '../styles/Menu.module.scss';
import { GridMode } from '../types/GridMode';
import { isValidateLanguage, SpecificatedLanguage } from '../types/Language';
import { objEntries } from '../utils/common';
import OptimizeParticleSetting from './OptimizeParticleSetting';
import { useLocale } from './ShapesGenerator';

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
    language: SpecificatedLanguage
    setLanguage: (value: SpecificatedLanguage) => void
    openImportModal: (isOpen: boolean) => void
    openExportModal: (isOpen: boolean) => void
}

const Menu = ({ gridMode, setGridMode, duplicatedPointRange, setDuplicatedPointRange, language, setLanguage, openImportModal, openExportModal }: MenuProps): JSX.Element => {
    const locale = useLocale();
    const onImport = useCallback(() => openImportModal(true), [openImportModal]);
    const onExport = useCallback(() => openExportModal(true), [openExportModal]);
    const onLanguageChange = useCallback(
        ({ target: { value } }: React.ChangeEvent<HTMLSelectElement>) => isValidateLanguage(value) && setLanguage(value),
        [setLanguage]
    );
    const onGridModeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setGridMode(parseInt(e.target.value)), [setGridMode]);

    return (
        <div className={styles['window']}>
            <Container fluid className={styles['container']}>
                <Row className={styles['row']}>
                    <Col>
                        <div className={styles['text']}>{locale('menu.language')}</div>
                        <Form.Control className={styles['selection']} as="select" value={language} onChange={onLanguageChange}>
                            {objEntries(languageMap).map(([code, name]) => (
                                <option key={code} value={code}>{name}</option>
                            ))}
                        </Form.Control>
                    </Col>
                </Row>
                <Row><Col><hr className={styles['line']} /></Col></Row>
                <Row className={styles['row']}>
                    <Col>
                        <div className={styles['text']}>{locale('menu.grid')}</div>
                        <ToggleButtonGroup type="radio" name="options" defaultValue={gridMode} value={gridMode}>
                            <ToggleButton className={styles['button']} value={0} onChange={onGridModeChange}>
                                {locale('menu.grid.off')}
                            </ToggleButton>
                            <ToggleButton className={styles['button']} value={1} onChange={onGridModeChange}>
                                {locale('menu.grid.block')}
                            </ToggleButton>
                            <ToggleButton className={styles['button']} value={2} onChange={onGridModeChange}>
                                {locale('menu.grid.double')}
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                </Row>
                <Row><Col><hr className={styles['line']} /></Col></Row>
                <Row className={styles['row']}>
                    <Col>
                        <OptimizeParticleSetting {...{ duplicatedPointRange, setDuplicatedPointRange }} />
                    </Col>
                </Row>
                <Row><Col><hr className={styles['line']} /></Col></Row>
                <Row className={styles['row']}>
                    <Col><Button onClick={onImport}>{locale('menu.import')}</Button></Col>
                    <Col><Button onClick={onExport}>{locale('menu.export')}</Button></Col>
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
