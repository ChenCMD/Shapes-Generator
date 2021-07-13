import uuid from 'uuidjs';
import { IdentifiedPoint } from './Point';

export interface ParameterMetaData {
    name: string
    description: string
}

export type Parameter<T extends string> = { argID: T, value: string } & ParameterMetaData;

export abstract class AbstractShapeNode<T extends string> {
    private readonly validateArgs: Set<string>;
    private _uuid: string;
    private _pointSet: IdentifiedPoint[] = [];
    public isSelected = false;
    public name: string;

    public constructor(
        private type: string,
        validateArgs: readonly T[],
        private readonly paramMetaData: Record<T, ParameterMetaData>,
        id: string,
        private _params: Record<T, string>
    ) {
        this.validateArgs = new Set(validateArgs);
        this._uuid = uuid.generate();
        this.name = id;
        const params: Partial<Record<T, number>> = {};
        for (const key of Object.keys(this.params) as T[]) params[key] = parseFloat(this.params[key]);

        this.updatePointSet(params as Record<T, number>);
    }

    public get uuid(): string {
        return this._uuid;
    }

    protected get params(): Record<T, string> {
        return this._params;
    }

    public get pointSet(): IdentifiedPoint[] {
        return this._pointSet;
    }

    protected set pointSet(points: IdentifiedPoint[]) {
        this._pointSet = points;
    }

    private isArgs(argName: string): argName is T {
        return this.validateArgs.has(argName);
    }

    public setParameter(argName: string, value: string): void {
        if (!this.isArgs(argName))
            throw new TypeError(`パラメータID '${argName}' は '${this.type}' には存在しません。`);
        this._params[argName] = value;

        const params: Partial<Record<T, number>> = {};
        for (const key of Object.keys(this.params) as T[]) params[key] = parseFloat(this.params[key]);

        this.updatePointSet(params as Record<T, number>);
    }

    public getParameterList(): Parameter<T>[] {
        const params: Parameter<T>[] = [];

        for (const argID of Object.getOwnPropertyNames(this.params) as T[]) {
            const value = this.params[argID];
            const { name, description } = this.paramMetaData[argID] ?? { name: '', description: '' };
            params.push({ argID, value, name, description });
        }
        return params;
    }

    protected abstract updatePointSet(params: Record<T, number>): void;

    public toExportObject(): string {
        return JSON.stringify({
            type: this.type,
            name: this.name,
            params: this.params
        });
    }
}