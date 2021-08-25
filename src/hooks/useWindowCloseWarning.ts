import React, { useEffect, useRef } from 'react';
import { useLocale } from '../components/ShapesGenerator';

const useWindowCloseWarning = (): React.MutableRefObject<boolean> => {
    const locale = useLocale();
    const isShowWarning = useRef<boolean>(false);

    useEffect(() => {
        const onBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isShowWarning.current) {
                e.preventDefault();
                e.returnValue = locale('close-warning');
            }
        };
        window.addEventListener('beforeunload', onBeforeUnload);
        return () => window.removeEventListener('beforeunload', onBeforeUnload);
    });

    return isShowWarning;
};

export default useWindowCloseWarning;