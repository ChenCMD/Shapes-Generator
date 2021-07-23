import { ShapeType } from '../ShapeNodes';
import { Param, ParamValue } from './Parameter';

export interface ExportObject {
    type: ShapeType
    name: string
    params: ParamValue<{ [k: string]: Param }>
}