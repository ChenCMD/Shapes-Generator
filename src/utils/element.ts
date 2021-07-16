export function getParentsId(elem: HTMLElement | null): string[] {
    return elem ? [elem.id, ...getParentsId(elem.parentElement)] : [];
}

export function createKeyboardEvent(key: string, altKey = false, ctrlKey = false, shiftKey = false): KeyboardEvent {
    return new KeyboardEvent(
        'keydown',
        { key, keyCode: key.charCodeAt(0), altKey, ctrlKey, shiftKey, metaKey: false, bubbles: true }
    );
}