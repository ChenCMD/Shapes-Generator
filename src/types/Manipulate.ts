import { TargetParameter, RawParam, MetaData } from './Parameter';
import { UUID } from './UUID';

export interface ManipulateShape {
    target: TargetParameter
}


interface ManipulateValue<T extends RawParam['value'] = RawParam['value']> {
    value: {
        manipulate: true
        value: T[]
        from: UUID
        old: T
    }
}


export type Manipulatable<T extends { type?: RawParam['type'] }> = (
    T extends { value: RawParam['value'] }
    ? Omit<T, 'value'> & (
        | { value: { manipulate?: false, value: T['value'] } }
        | ManipulateValue<T['value']>
    )
    : T
) & { manipulatable: true };


export function isManipulatable(v: unknown): v is Manipulatable<RawParam>['value'];
export function isManipulatable(v: unknown, metaData: MetaData): v is Manipulatable<RawParam>['value'];
export function isManipulatable(v: unknown, metaData?: MetaData): v is Manipulatable<RawParam>['value'] {
    return metaData
        ? !!metaData.manipulatable
        : typeof v === 'object' && !!v && 'value' in v;
}

export function isManipulateParam(metaData: MetaData, v: unknown): v is ManipulateValue<RawParam['value']>['value'] {
    const type = metaData.type ?? 'normal';
    if (metaData.manipulatable && isManipulatable(v) && v.manipulate) {
        const checkElem = (arr: unknown[]): boolean => {
            if (type === 'normal' || type === 'range') {
                return arr.every((v2: unknown) => typeof v2 === 'number');
            }
            if (type === 'pos') {
                return arr.every((v2: unknown) => typeof v2 === 'object' && !!v2 && 'x' in v2 && 'y' in v2);
            }
            if (type === 'boolean') {
                return arr.every((v2: unknown) => typeof v2 === 'boolean');
            }
            if (type === 'target') {
                return arr.every((v2: unknown) => typeof v2 === 'object' && !!v2 && 'target' in v2 && 'arg' in v2);
            }
            return false;
        };
        return checkElem(v.value);
    }
    return false;
}