import React, { useEffect, useRef } from 'react';

const useWindowCloseWarning = (): React.MutableRefObject<boolean> => {
    const isShowWarning = useRef<boolean>(false);

    useEffect(() => {
        const onBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isShowWarning.current) {
                e.preventDefault();
                e.returnValue = '出力されていないデータが存在します。本当に閉じますか？';
            }
        };
        window.addEventListener('beforeunload', onBeforeUnload);
        return () => window.removeEventListener('beforeunload', onBeforeUnload);
    });

    return isShowWarning;
};

export default useWindowCloseWarning;