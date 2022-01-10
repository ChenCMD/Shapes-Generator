/* eslint-disable @typescript-eslint/no-explicit-any */

import { Migration } from '../types/Migration';

function nonCalledError(): never {
    throw new Error('There is a mistake in the migration data');
}

// eslint-disable-next-line @typescript-eslint/ban-types
function isObject(v: unknown): v is ({ [k: string]: unknown }) {
    return typeof v === 'object' && !!v;
}

export const migrations: Migration[] = [
    {
        version: 1,
        migrator: (schema: { [k: string]: unknown }[]): { [k: string]: unknown }[] => schema.map(v => {
            if (typeof v.type !== 'string' || !isObject(v.params)) nonCalledError();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { vezier, ...params } = v.params;
            const wrapValue = (value: unknown) => (typeof value === 'object' && !!value && !('value' in value)) ? { value } : value;
            return {
                ...v,
                params: {
                    ...params,
                    ...['line', 'line-anchor'].includes(v.type)
                        ? { from: wrapValue(v.params.from), to: wrapValue(v.params.to) }
                        : { center: wrapValue(v.params.center) },
                    ...['line', 'line-anchor', 'polygon', 'polygon-anchor'].includes(v.type)
                        ? { bezier: v.params.vezier ?? v.params.bezier }
                        : {}
                }
            };
        })
    },
    {
        version: 2,
        migrator: (schema: { [k: string]: unknown }[]): { [k: string]: unknown }[] => schema.map(v => {
            if (typeof v.type !== 'string' || !isObject(v.params)) nonCalledError();
            const { isBezierEquallySpaced, ...params } = v.params;
            return {
                ...v,
                params: {
                    ...params,
                    ...isBezierEquallySpaced === undefined
                        ? {}
                        : ['circle', 'circle-anchor'].includes(v.type)
                            ? { isEllipseEquallySpaced: isBezierEquallySpaced }
                            : { isBezierEquallySpaced }
                }
            };
        })
    }
];