export function getParentsId(elem: HTMLElement | null): string[] {
    return elem ? [elem.id, ...getParentsId(elem.parentElement)] : [];
}