export interface ParameterMetaData {
    name: string
    description: string
}

export type Parameter<T extends string> = { argID: T, value: string } & ParameterMetaData;

export interface Point {
    id: string
    x: number
    y: number
}

export abstract class AbstractShapeNode<T extends string> {
    private _pointSet: Point[] = [];

    public constructor(
        private _name: string,
        private _params: Record<T, string>,
        private readonly paramMetaData: Record<T, ParameterMetaData>,
        private readonly nameSet: Set<string>
    ) {
        const params: Partial<Record<T, number>> = {};
        for (const key of Object.keys(this.params) as T[]) params[key] = parseFloat(this.params[key]);

        this.updatePointSet(params as Record<T, number>);
    }

    public get name(): string {
        return this._name;
    }

    public setName(name: string): boolean {
        if (this.nameSet.has(name)) return false;
        this.nameSet.delete(this.name);
        this.nameSet.add(name);
        this._name = name;
        return true;
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

        for (const argID of Object.keys(this.params) as T[]) {
            const value = this.params[argID];
            const { name, description } = this.paramMetaData[argID] ?? { name: '', description: '' };
            params.push({ argID, value, name, description });
        }
        return params;
    }

    protected abstract updatePointSet(params: Record<T, number>): void;
}