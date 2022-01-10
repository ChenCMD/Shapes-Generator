import React, { useEffect, useRef } from 'react';
import { useLocale } from '../components/ShapesGenerator';

const useWindowCloseWarning = (): React.MutableRefObject<boolean> => {
    const locale = useLocale();
    const isSaved = useRef<boolean>(true);

    useEffect(() => {
        const onBeforeUnload = (e: BeforeUnloadEvent) => {
            if (!isSaved.current) {
                e.preventDefault();
                e.returnValue = locale('close-warning');
            }
        };
        window.addEventListener('beforeunload', onBeforeUnload);
        return () => window.removeEventListener('beforeunload', onBeforeUnload);
    });

    return isSaved;
};

export default useWindowCloseWarning;