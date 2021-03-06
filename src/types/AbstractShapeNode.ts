import rfdc from 'rfdc';
import { ShapeType } from '../ShapeNodes';
import { ExportObject } from './ExportObject';
import { ManipulateShape, isManipulatable, isManipulateParam, Manipulatable } from './Manipulate';
import { ParamMetaData, Param, ParamValue, Parameter, TargetParameter, RawParam } from './Parameter';
import { IdentifiedPoint, Point } from './Point';
import { generateUUID, UUID } from './UUID';

export abstract class AbstractShapeNode<T extends { [key in keyof T]: Param }> {
    // Set<P>にしないのはAbstractShapeNode#setParameterでのvalidationが面倒になるため。
    private validateParams: Set<string>;
    private _params: ParamValue<T>;
    private _uuid: UUID;
    private _points: IdentifiedPoint[] = [];
    public isSelected = false;

    public constructor(
        public readonly type: ShapeType,
        defaultParams: ParamValue<T>,
        private readonly paramMetaData: ParamMetaData<T>,
        public name: string,
        params: ParamValue<{ [k: string]: Param }>,
        public readonly isManipulateShape: boolean,
        uuid?: UUID
    ) {
        this.validateParams = new Set(Object.keys(paramMetaData));
        this._params = { ...rfdc()(defaultParams), ...params };
        this._uuid = uuid ?? generateUUID();
        this.updatePointSet();
    }

    public get uuid(): UUID {
        return this._uuid;
    }

    public get points(): IdentifiedPoint[] {
        return this._points;
    }

    private isManipulate(params: ParamValue<T>): params is ParamValue<T & ManipulateShape> {
        return this.isManipulateShape;
    }

    private isParameterKey(argName: string): argName is Extract<keyof T, string> {
        return this.validateParams.has(argName);
    }

    private isParameterValue(argName: keyof T, v: unknown): v is T[keyof T]['value'] {
        // normal | range -> number, pos -> { x: number, y: number };
        const type = this.paramMetaData[argName].type ?? 'normal';
        if (this.paramMetaData[argName].manipulatable) {
            if (!isManipulatable(v)) {
                return false;
            }
            if (v.manipulate) {
                const checkElem = (arr: unknown[]): boolean => {
                    switch (type) {
                        case 'normal':
                        case 'range':
                            return arr.every(v2 => typeof v2 === 'number');
                        case 'pos':
                            return arr.every(v2 => typeof v2 === 'object' && !!v2 && 'x' in v2 && 'y' in v2);
                        case 'boolean':
                            return arr.every(v2 => typeof v2 === 'boolean');
                        case 'target':
                            return arr.every(v2 => typeof v2 === 'object' && !!v2 && 'target' in v2 && 'arg' in v2);
                    }
                };
                return checkElem(v.value);
            }
            v = v.value;
        }
        if (type === 'normal' || type === 'range') {
            return typeof v === 'number';
        }
        if (type === 'pos') {
            return typeof v === 'object' && !!v && 'x' in v && 'y' in v;
        }
        if (type === 'boolean') {
            return typeof v === 'boolean';
        }
        if (type === 'target') {
            return typeof v === 'object' && !!v && 'target' in v && 'arg' in v;
        }
        return false;
    }

    public destroy(disManipulateAction: (target: TargetParameter['value']) => void): void {
        if (!this.isManipulate(this._params)) {
            return;
        }
        disManipulateAction(this._params.target);
    }

    public setParameter(argName: string, value: unknown, manipulateAction: (points: Point[], from: UUID, prev: TargetParameter['value'] | undefined, next: TargetParameter['value'] | undefined) => void): void {
        if (!this.isParameterKey(argName)) {
            return;
        }
        if (!this.isParameterValue(argName, value)) {
            if (!this.paramMetaData[argName].manipulatable) {
                return;
            }
            value = { value: value };
            if (!this.isParameterValue(argName, value)) {
                return;
            }
        }
        const prevTarget = this.isManipulate(this._params) ? this._params['target'] : undefined;

        const param = this._params[argName];
        if (isManipulateParam(this.paramMetaData[argName], value) && isManipulatable(param, this.paramMetaData[argName]) && !Array.isArray(param.value)) {
            value.old = param.value;
        }

        this._params[argName] = value;
        this.updatePointSet();
        if (this.isManipulate(this._params)) {
            manipulateAction(this._points.map(v => v), this._uuid,
                (prevTarget?.target && prevTarget?.arg) ? prevTarget : undefined,
                (this._params['target'].target && this._params['target'].arg) ? this._params['target'] : undefined
            );
        }
    }

    public getParameterMap(): [string, Parameter][] {
        const params: [string, Parameter][] = [];
        for (const key of Object.getOwnPropertyNames(this._params)) {
            params.push([key, { ...this.paramMetaData[key as keyof T], value: this._params[key as keyof T] } as Parameter]);
        }

        return params;
    }

    public disManipulate(argName: string, manipulateAction: (points: Point[], from: UUID, prev: TargetParameter['value'] | undefined, next: TargetParameter['value'] | undefined) => void): void {
        if (!this.isParameterKey(argName)) {
            return;
        }
        const value = this._params[argName];
        if (!isManipulateParam(this.paramMetaData[argName], value)) {
            return;
        }
        this.setParameter(argName, { value: value.old }, manipulateAction);
    }

    public getManipulatableParams(): [argName: string, isManipulated: boolean][] {
        const params: [argName: string, isManipulated: boolean][] = [];
        for (const k in this.paramMetaData) {
            if (this.paramMetaData[k].manipulatable) {
                params.push([k, (this._params[k] as Manipulatable<RawParam>['value']).manipulate ?? false]);
            }
        }
        return params;
    }

    private updatePointSet(): void {
        this._points = this.generatePointSet(this._params);
    }

    protected getParams(): ParamValue<T> {
        const res = rfdc()(this._params);
        if (this.isManipulate(res)) {
            res['target'].arg = '';
        }
        return res;
    }

    protected abstract generatePointSet(params: ParamValue<T>): IdentifiedPoint[];

    public abstract clone(): AbstractShapeNode<T>;

    public toExportObject(): ExportObject {
        return {
            type: this.type,
            uuid: this.uuid,
            name: this.name,
            params: this._params
        };
    }
}