export interface NormalParameter {
    type?: 'normal'
    value: number
}

export interface PosParameter {
    type: 'pos'
    value: { x: number, y: number }
    unit: ''
}

export interface RangeParameter {
    type: 'range'
    value: number
    min: number
    max: number
    step: number
}

export interface TargetParameter {
    type: 'target'
    value: { target: string, arg: string }
}

interface ParamMetaDataBase {
    manipulatable?: false
    unit?: string
    validation?: {
        min?: number
        max?: number
    }
}

export interface ManipulateShape {
    target: TargetParameter
}

export type RawParam = NormalParameter | PosParameter | RangeParameter | TargetParameter;

interface ManipulateValue<T extends RawParam['value'] = RawParam['value']> {
    value: {
        manipulate: true
        value: T[]
        manipulatedFrom: string
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

export type Param<T extends { type?: RawParam['type'] } = RawParam> = RawParam | Manipulatable<T>;

type MetaData<T extends { type?: RawParam['type'] } = Param> = T extends Manipulatable<infer U>
    ? Omit<ParamMetaDataBase, 'manipulatable'> & Manipulatable<Omit<U, 'value'>>
    : ParamMetaDataBase & Omit<T, 'value'>;
export type ParamMetaData<T extends { [k in keyof T]: Param }> = { [k in keyof T]: MetaData<T[k]> };
export type ParamValue<T extends { [k in keyof T]: Param }> = { [k in keyof T]: T[k]['value'] };
export type Parameter<T extends RawParam = RawParam> = (T & ParamMetaDataBase) | (T extends PosParameter
    ? Omit<ParamMetaDataBase, 'manipulatable'> & Manipulatable<T>
    : never);

export function getPosParameterValue(param: Parameter<PosParameter>): { x: string, y: string } {
    if (!param.manipulatable)
        return { x: param.value.x.toString(), y: param.value.y.toString() };
    return param.value.manipulate
        ? { x: 'manipulated', y: 'manipulated' }
        : { x: param.value.value.x.toString(), y: param.value.value.y.toString() };
}

export function validateParam(value: string | number, validation: ParamMetaDataBase['validation']): boolean {
    if (!validation) return true;
    if (typeof value === 'string') {
        if (!(/^[+,-]?(?:[1-9]\d*|0)(?:\.\d+)?$/.test(value)))
            return false;
        value = parseFloat(value);
    }

    if (validation.min && value < validation.min)
        return false;
    if (validation.max && validation.max < value)
        return false;

    return true;
}

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
            if (type === 'normal' || type === 'range') return arr.every((v2: unknown) => typeof v2 === 'number');
            if (type === 'pos') return arr.every((v2: unknown) => typeof v2 === 'object' && !!v2 && 'x' in v2 && 'y' in v2);
            if (type === 'target') return arr.every((v2: unknown) => typeof v2 === 'object' && !!v2 && 'target' in v2 && 'arg' in v2);
            return false;
        };
        return checkElem(v.value);
    }
    return false;
}