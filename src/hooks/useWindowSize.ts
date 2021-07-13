import { useState, useEffect, useCallback } from 'react';

const useWindowSize = (): { width: number, height: number } => {
    const getWindowSize = useCallback(() => ({
        width: window.innerWidth,
        height: window.innerHeight
    }), []);
    const [windowSize, setWindowDimensions] = useState<{ width: number, height: number }>(getWindowSize());
    const onResize = useCallback(() => setWindowDimensions(getWindowSize()), [getWindowSize]);

    useEffect(() => {
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [onResize]);

    return windowSize;
};

export default useWindowSize;
