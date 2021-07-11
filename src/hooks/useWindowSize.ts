import { useState, useEffect } from 'react';

const useWindowSize = (): { width: number, height: number } => {
    const getWindowSize = () => ({
        width: window.innerWidth,
        height: window.innerHeight
    });

    const [windowSize, setWindowDimensions] = useState<{ width: number, height: number }>(getWindowSize());

    useEffect(() => {
        const onResize = () => {
            setWindowDimensions(getWindowSize());
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return windowSize;
};

export default useWindowSize;
