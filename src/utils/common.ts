export function toRadians(degree: number): number {
    return degree * (Math.PI / 180);
}

export function mod(n: number, m: number): number {
    return (n % m + m) % m;
}