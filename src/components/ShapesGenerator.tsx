import React, { createContext, useCallback, useContext, useMemo, useReducer, useState } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import { toast, ToastContainer } from 'react-toastify';
import useLocalize from '../hooks/useLocalize';
import useWindowCloseWarning from '../hooks/useWindowCloseWarning';
import { locale as rawLocale } from '../locales';
import createReducer from '../reducers/shapesReducer';
import { importShape, Shape } from '../ShapeNodes';
import styles from '../styles/ShapesGenerator.module.scss';
import { GridMode } from '../types/GridMode';
import { deleteDuplicatedPoints, Point } from '../types/Point';
import { createKeyboardEvent } from '../utils/element';
import ContextMenu from './ContextMenu';
import ExportModal from './ExportModal';
import ImportModal from './ImportModal';
import Previewer from './Previewer';
import UserInterface from './UserInterface';

export const showNotification = (type: 'info' | 'success' | 'warning' | 'error' | 'dark', message: string): void => {
    toast[type](message, {
        position: 'bottom-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined
    });
};

const LocaleContext = createContext<typeof rawLocale>((key, ...params) => rawLocale(key, ...params));

export const useLocale: () => typeof rawLocale = () => useContext(LocaleContext);

interface ShapesGeneratorProps {
    initialShapeKey?: string
    initialLanguage?: string
}

const ShapesGenerator = ({ initialShapeKey, initialLanguage }: ShapesGeneratorProps): JSX.Element => {
    const isSaved = useWindowCloseWarning();
    const { locale, language, setLanguage } = useLocalize(initialLanguage);
    const [[shapes, latestSelect], shapesDispatch] = useReducer(
        createReducer(() => isSaved.current = false),
        useMemo<[Shape[], number[]]>(() => [initialShapeKey ? importShape(initialShapeKey) : [], []], [initialShapeKey])
    );
    const [gridMode, setGridMode] = useState<GridMode>(GridMode.block);
    const [duplicatedPointRange, setDuplicatedPointRange] = useState<number>(0);
    const [isExportModalOpened, setExportModalOpened] = useState<boolean>(false);
    const [isImportModalOpened, setImportModalOpened] = useState<boolean>(false);
    const [contextTarget, setContextTarget] = useState<Point & { index: number } | undefined>();

    const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLElement>) => {
        if (contextTarget && e.key === 'Escape') {
            return setContextTarget(undefined);
        }
        // こっちでは処理できないキー
        const elem = document.getElementById(`shape-list-item-${latestSelect.slice(-1)[0]}`);
        elem?.dispatchEvent(createKeyboardEvent('keydown', e.key, e.altKey, e.ctrlKey, e.shiftKey));
    }, [contextTarget, latestSelect]);

    const onContextCloseRequest = useCallback(() => setContextTarget(undefined), []);

    const dependString = useMemo(() => shapes.map(v => `${v.isSelected ? 1 : 0}${v.points.map(v2 => v2.id).join('+')}`).join('+'), [shapes]);
    const [processedPoints, processedPointsWithoutManipulate] = useMemo(
        () => {
            const p = deleteDuplicatedPoints(shapes, duplicatedPointRange);
            return [p, p.filter(v => !v.isManipulateShape)];
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [duplicatedPointRange, dependString]
    );

    return (
        <LocaleContext.Provider value={locale}>
            <Container fluid className={styles['container']} onKeyDown={onKeyDown} tabIndex={-1}>
                <Row noGutters>
                    <Col xl={6} lg={6} md={12} sm={12} xs={12}>
                        <Previewer
                            shapes={processedPoints}
                            {...{ gridMode }}
                        />
                    </Col>
                    <Col xl={6} lg={6} md={12} sm={12} xs={12}>
                        <UserInterface
                            openImportModal={setImportModalOpened}
                            openExportModal={setExportModalOpened}
                            {...{
                                shapes, latestSelect, shapesDispatch, gridMode, setGridMode, duplicatedPointRange,
                                setDuplicatedPointRange, language, setLanguage, setContextTarget
                            }}
                        />
                    </Col>
                </ Row>
            </Container>
            <ImportModal
                isOpen={isImportModalOpened}
                {...{ setImportModalOpened, shapesDispatch }}
            />
            <ExportModal
                points={processedPointsWithoutManipulate}
                isOpen={isExportModalOpened}
                setExportModalOpened={setExportModalOpened}
                {...{ shapes, duplicatedPointRange, setDuplicatedPointRange, isSaved }}
            />
            <ContextMenu
                onCloseRequest={onContextCloseRequest}
                {...{ ...contextTarget, shapesDispatch }}
            />
            <ToastContainer
                position="bottom-left"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable={false}
                pauseOnHover
                limit={5}
            />
        </LocaleContext.Provider>
    );
};

export default ShapesGenerator;
