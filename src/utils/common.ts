export function toRadians(degree: number): number {
    return degree * (Math.PI / 180);
}

export function mod(n: number, m: number): number {
    return (n % m + m) % m;
}

export function round(n: number, places = 0): number {
    const base = 10 ** places;
    return Math.round(n * base) / base;
}

export function ceil(n: number, places = 0): number {
    const base = 10 ** places;
    return Math.ceil(n * base) / base;
}

export function floor(n: number, places = 0): number {
    const base = 10 ** places;
    return Math.floor(n * base) / base;
}