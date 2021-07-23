import { Param, ParamValue } from './Parameter';

export interface ExportObject {
    type: string
    name: string
    params: ParamValue<{ [k: string]: Param }>
}