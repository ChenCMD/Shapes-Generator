import { useCallback } from 'react';

const keyPushState: { [k: string]: boolean } = {};

type Callback = (e: React.KeyboardEvent<HTMLElement>) => void;
const useOnceKeydown = (key: string, callback: Callback): [keydownCallback: Callback, keyupCallback: () => void] => {
    if (keyPushState[key] === undefined) {
        keyPushState[key] = false;
    }

    const keydownCallback = useCallback<Callback>(e => {
        if (!keyPushState[key]) {
            keyPushState[key] = true;
            callback(e);
        }
    }, [callback, key]);

    const keyupCallback = useCallback(() => keyPushState[key] = false, [key]);

    return [keydownCallback, keyupCallback];
};

export default useOnceKeydown;