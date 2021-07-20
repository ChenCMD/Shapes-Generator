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

interface ParamMetaDataBase {
    name: string
    description: string
    unit?: string
    validation?: {
        min?: number
        max?: number
    }
}

export type Param = NormalParameter | PosParameter | RangeParameter;

export type ParamMetaData<T extends { [k in keyof T]: Param }> = { [k in keyof T]: ParamMetaDataBase & Omit<T[k], 'value'> };
export type ParamValue<T extends { [k in keyof T]: Param }> = { [k in keyof T]: T[k]['value'] };
export type Parameter<T extends Param> = T & ParamMetaDataBase;