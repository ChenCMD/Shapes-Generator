import React, { useEffect, useRef } from 'react';
import { locale } from '../locales';

const useWindowCloseWarning = (): React.MutableRefObject<boolean> => {
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