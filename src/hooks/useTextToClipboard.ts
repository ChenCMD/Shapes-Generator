import { useCallback } from 'react';

const useTextToClipboard = (): (text: string) => void => {
    const createListener = (text: string) => {
        const listener = (e: ClipboardEvent) => {
            e.preventDefault();
            e.clipboardData?.setData('text/plain', text);
            document.removeEventListener('copy', listener);
        };
        return listener;
    };

    return useCallback((text: string) => {
        document.addEventListener('copy', createListener(text));
        document.execCommand('copy');
    }, []);
};

export default useTextToClipboard;