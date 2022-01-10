import { Manipulatable } from './Manipulate';
import { UUID } from './UUID';

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

export interface BoolParameter {
    type: 'boolean'
    value: boolean
}

export interface TargetParameter {
    type: 'target'
    value: { target: UUID | '', arg: string }
}

interface ParamMetaDataBase {
    manipulatable?: false
    unit?: string
    validation?: {
        min?: number
        max?: number
    }
}

export type RawParam = NormalParameter | PosParameter | RangeParameter | BoolParameter | TargetParameter;

export type Param<T extends { type?: RawParam['type'] } = RawParam> = RawParam | Manipulatable<T>;

export type MetaData<T extends { type?: RawParam['type'] } = Param> = T extends Manipulatable<infer U>
    ? Omit<ParamMetaDataBase, 'manipulatable'> & Manipulatable<Omit<U, 'value'>>
    : ParamMetaDataBase & Omit<T, 'value'>;

export type ParamMetaData<T extends { [k in keyof T]: Param }> = { [k in keyof T]: MetaData<T[k]> };

export type ParamValue<T extends { [k in keyof T]: Param }> = { [k in keyof T]: T[k]['value'] };

export type Parameter<T extends RawParam = RawParam> = (T & ParamMetaDataBase) | (T extends PosParameter
    ? Omit<ParamMetaDataBase, 'manipulatable'> & Manipulatable<T>
    : never);

export function getPosParameterValue(param: Parameter<PosParameter>): { x: string, y: string } {
    if (!param.manipulatable) {
        return { x: param.value.x.toString(), y: param.value.y.toString() };
    }
    return param.value.manipulate
        ? { x: 'manipulated', y: 'manipulated' }
        : { x: param.value.value.x.toString(), y: param.value.value.y.toString() };
}

export function validateParam(value: string | number, validation: ParamMetaDataBase['validation']): boolean {
    if (!validation) {
        return true;
    }
    if (typeof value === 'string') {
        if (!(/^[+,-]?(?:[1-9]\d*|0)(?:\.\d+)?$/.test(value))) {
            return false;
        }
        value = parseFloat(value);
    }

    if (validation.min && value < validation.min) {
        return false;
    }
    if (validation.max && validation.max < value) {
        return false;
    }

    return true;
}