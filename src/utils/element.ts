export function getParentsId(elem: HTMLElement | null): string[] {
    return elem ? [elem.id, ...getParentsId(elem.parentElement)] : [];
}

export function createKeyboardEvent(type: 'keydown' | 'keyup', key: string, altKey = false, ctrlKey = false, shiftKey = false): KeyboardEvent {
    return new KeyboardEvent(
        type,
        { key, keyCode: key.charCodeAt(0), altKey, ctrlKey, shiftKey, metaKey: false, bubbles: true }
    );
}

export function stopPropagation(e: { stopPropagation(): void }): void {
    e.stopPropagation();
}