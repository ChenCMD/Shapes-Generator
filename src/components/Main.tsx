import React, { useMemo, useState } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import ExportModal from './ExportModal';
import ImportModal from './ImportModal';
import Previewer from './Previewer';
import UserInterface from './UserInterface';
import styles from '../styles/Main.module.scss';
import { GridMode } from '../types/GridMode';
import { deleteDuplicatedPoints, IndexedPoint } from '../types/Point';
import { Shape } from '../ShapeNodes';
import { SpecificatedLanguage } from '../types/Language';
import { ShapesDispatch } from '../reducers/shapesReducer';
import { StateDispatcher } from '../types/StateDispatcher';

interface MainProps {
    shapes: Shape[]
    latestSelect: number[]
    shapesDispatch: ShapesDispatch
    language: SpecificatedLanguage
    setLanguage: StateDispatcher<string>
    setContextTarget: StateDispatcher<IndexedPoint | undefined>
    isSaved: React.MutableRefObject<boolean>
}

const Main = ({ shapes, latestSelect, shapesDispatch, language, setLanguage, setContextTarget, isSaved }: MainProps): JSX.Element => {
    const [gridMode, setGridMode] = useState<GridMode>(GridMode.block);
    const [duplicatedPointRange, setDuplicatedPointRange] = useState<number>(0);
    const [isExportModalOpened, setExportModalOpened] = useState<boolean>(false);
    const [isImportModalOpened, setImportModalOpened] = useState<boolean>(false);

    const dependString = useMemo(() => shapes.map(v => `${v.isSelected ? 1 : 0}${v.points.map(v2 => v2.id).join('+')}`).join('+'), [shapes]);
    const [processedPoints, processedPointsWithoutManipulate] = useMemo(
        () => {
            const p = deleteDuplicatedPoints(shapes, duplicatedPointRange);
            return [p, p.filter(v => !v.isManipulateShape)];
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [duplicatedPointRange, dependString]
    );

    return <>
        <Container fluid className={styles['container']}>
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
    </>;
};

export default React.memo(Main);