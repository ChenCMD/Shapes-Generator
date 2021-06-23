import uuid from 'uuidjs';
import { Point } from './Point';

export interface ParameterMetaData {
    name: string
    description: string
}

export type Parameter<T extends string> = { argID: T, value: string } & ParameterMetaData;

export abstract class AbstractShapeNode<T extends string> {
    private _uuid: string;
    private _pointSet: Point[] = [];
    public name: string;

    public constructor(
        id: string,
        private _params: Record<T, string>,
        private readonly paramMetaData: Record<T, ParameterMetaData>
    ) {
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

    public get pointSet(): Point[] {
        return this._pointSet;
    }

    protected set pointSet(points: Point[]) {
        this._pointSet = points;
    }

    public setParameter(argName: T, value: string): void {
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
}