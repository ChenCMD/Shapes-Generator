import React, { createContext, useCallback, useContext, useMemo, useReducer, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import useLocalize from '../hooks/useLocalize';
import useWindowCloseWarning from '../hooks/useWindowCloseWarning';
import { locale as rawLocale } from '../locales';
import createReducer from '../reducers/shapesReducer';
import { importShape, Shape } from '../ShapeNodes';
import { IndexedPoint } from '../types/Point';
import { createKeyboardEvent } from '../utils/element';
import ContextMenu from './ContextMenu';
import Main from './Main';

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
    const [contextTarget, setContextTarget] = useState<IndexedPoint | undefined>();

    const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLElement>) => {
        if (contextTarget && e.key === 'Escape') {
            return setContextTarget(undefined);
        }
        // こっちでは処理できないキー
        const elem = document.getElementById(`shape-list-item-${latestSelect.slice(-1)[0]}`);
        elem?.dispatchEvent(createKeyboardEvent('keydown', e.key, e.altKey, e.ctrlKey, e.shiftKey));
    }, [contextTarget, latestSelect]);

    const onContextCloseRequest = useCallback(() => setContextTarget(undefined), []);

    return (
        <div onKeyDown={onKeyDown} tabIndex={-1}>
            <LocaleContext.Provider value={locale}>
                <Main {...{ shapes, latestSelect, shapesDispatch, language, setLanguage, setContextTarget, isSaved }} />
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
        </div>
    );
};

export default ShapesGenerator;
