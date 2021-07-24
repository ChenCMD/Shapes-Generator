import React, { useCallback, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Col from 'react-bootstrap/esm/Col';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import ReactModal from 'react-modal';
import { ShapesDispatch } from '../reducers/shapesReducer';
import { importShape } from '../ShapeNodes';
import styles from '../styles/ImportModal.module.scss';
import { stopPropagation } from '../utils/element';
import FileUploader from './FileUploader';

ReactModal.setAppElement('#root');

interface ImportModalProps {
    openImportModal: (isOpen: boolean) => void
    isOpen: boolean
    shapesDispatch: ShapesDispatch
}

const ImportModal = ({ openImportModal, isOpen, shapesDispatch }: ImportModalProps): JSX.Element => {
    const [importKey, setImportKey] = useState<string>('');

    const onRequestClose = useCallback(() => openImportModal(false), [openImportModal]);

    const onImport = useCallback(() => {
        shapesDispatch({ type: 'addMany', shapes: importShape(importKey) });
        onRequestClose();
    }, [importKey, onRequestClose, shapesDispatch]);

    const onFileUpload = useCallback((files: FileList) => {
        files[0].text().then(text => {
            const key = text.match(/(?<=\[ImportKey\]: ).*(?=\r?\n)/);
            if (!key) {
                console.error('importKeyが存在しません'); // TODO エラー表示作る
                return;
            }
            shapesDispatch({ type: 'addMany', shapes: importShape(key[0]) });
            onRequestClose();
        });
    }, [onRequestClose, shapesDispatch]);

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
            <FileUploader accept=".mcfunction" onFileUpload={onFileUpload}>{openUploader => (
                <Container fluid className={styles['container']}>
                    <Row noGutters>
                        <Col className={styles['col']}>
                            <div className={styles['text']}>Import Key</div>
                            <input className={styles['input']} onChange={e => setImportKey(e.target.value)} value={importKey} onKeyDown={stopPropagation} />
                        </Col>
                    </Row>
                    <Row><Col><hr className={styles['line']} /></Col></Row>
                    <Row noGutters>
                        <Col className={styles['col']} xl={6} lg={6} md={6} sm={12} xs={12}>
                            <Button onClick={onRequestClose}>Cancel</Button>
                        </Col>
                        <Col className={styles['col']} xl={6} lg={6} md={6} sm={12} xs={12}>
                            <Button onClick={importKey === '' ? openUploader : onImport}>
                                {importKey === '' ? 'Import from mcfunction' : 'Import from Key'}
                            </Button>
                        </Col>
                    </Row>
                </Container>
            )}</FileUploader>
        </ReactModal >
    );
};

export default React.memo(ImportModal);
