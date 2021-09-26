import { ExportObject } from '../types/ExportObject';
import { migrations } from './migrations';

export function migrate(obj: { [k: string]: unknown }[], ver: number, targetVer: number): ExportObject[] {
    const newObj = migrations.find(v => v.version === ver)?.migrator(obj) ?? obj;
    return ver + 1 >= targetVer
        ? newObj as unknown as ExportObject[]
        : migrate(newObj, ver + 1, targetVer);
}