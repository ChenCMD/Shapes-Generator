import { ShapeType } from '../ShapeNodes';
import { Param, ParamValue } from './Parameter';
import { UUID } from './UUID';

export interface ExportObject {
    type: ShapeType
    uuid?: UUID
    name: string
    params: ParamValue<{ [k: string]: Param }>
}