import { Point } from '../types/Point';

export function toRadians(degree: number): number {
    return degree * (Math.PI / 180);
}

export function mod(n: number, m: number): number {
    return (n % m + m) % m;
}

export function round(n: number, places = 1): number {
    const base = 10 ** places;
    return Math.round(n * base) / base;
}

export function ceil(n: number, places = 1): number {
    const base = 10 ** places;
    return Math.ceil(n * base) / base;
}

export function floor(n: number, places = 1): number {
    const base = 10 ** places;
    return Math.floor(n * base) / base;
}

export function rotateMatrix2D({ x, y }: Point, rotation: number): Point {
    const radian = toRadians(rotation);
    return {
        x: x * Math.cos(radian) - y * Math.sin(radian),
        y: x * Math.sin(radian) + y * Math.cos(radian)
    };
}

interface SampledPoint {
    t: number
    x: number
    y: number
}
/**
 * 連続関数 `(xAt, yAt)` の `[0, 1]` 区間上をサンプリングする。
 * 与えられた関数が連続でない場合処理の終了が保証されない。
 *
 * 返される配列 `arr` は以下の性質を満たす：
 *  - `arr` は `t` でソートされている
 *  - `arr` の最初の要素の `t` は `0` で、 最後の要素の `t` は `1` である
 *  - `arr` の隣り合う二要素 `p1`, `p2` は以下の二条件のうちいずれかを満たす：
 *    - 二点間の距離が `maximumRangeGap` よりも小さい
 *    - `p2.t - p1.t < minimumDomainGap`
 */
export function sampleDensely(pointAt: (t: number) => { x: number, y: number }, maximumRangeGap = 0.1, minimumDomainGap = 0.001): SampledPoint[] {
    const sampleAt = (t: number) => ({ t, ...pointAt(t) });
    const sufficientlyClose = (p1: SampledPoint, p2: SampledPoint) => ((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2 < maximumRangeGap ** 2) || Math.abs(p1.t - p2.t) < minimumDomainGap;
    const midTOf = (p1: SampledPoint, p2: SampledPoint) => (p1.t + p2.t) / 2.0;

    const results: SampledPoint[] = [sampleAt(0.0)];
    let nextSampleT: number | undefined = 1.0;
    const sampledAhead: SampledPoint[] = [];

    while (true) {
        const lastResult = results[results.length - 1];

        if (nextSampleT !== undefined) {
            const nextSample = sampleAt(nextSampleT);

            if (sufficientlyClose(lastResult, nextSample)) {
                results.push(nextSample);
                nextSampleT = undefined;
            } else {
                nextSampleT = midTOf(lastResult, nextSample);
                sampledAhead.push(nextSample);
            }
        } else if (sampledAhead.length !== 0) {
            const nextSampleAhead = sampledAhead.pop()!;

            if (sufficientlyClose(lastResult, nextSampleAhead)) {
                results.push(nextSampleAhead);
            } else {
                nextSampleT = midTOf(lastResult, nextSampleAhead);
                sampledAhead.push(nextSampleAhead);
            }
        } else {
            return results;
        }
    }
}

export function spreadSamplesOver(samples: SampledPoint[], interpolatedPoints: number, isOpenIntervalRight = false): Point[] {
    type SampleWithDistance = SampledPoint & { distance: number };

    // p1とp2の距離を返す関数
    const distanceBetween = (p1: SampledPoint, p2: SampledPoint) => Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
    // 各samplesのdistance(p_iとp_i+1の距離)を計算する即時関数
    const samplesWithDistances = (() => {
        const points: SampleWithDistance[] = [{ ...samples[0], distance: 0.0 }];
        let distanceSoFar = 0.0;
        for (let i = 0; i + 1 < samples.length; i++) {
            distanceSoFar += distanceBetween(samples[i], samples[i + 1]);
            points.push({ ...samples[i + 1], distance: distanceSoFar });
        }
        return points;
    })();
    const linearlyInterpolate = (p1: SampleWithDistance, p2: SampleWithDistance, targetDistance: number) => {
        const ratio = (targetDistance - p1.distance) / (p2.distance - p1.distance);

        return ({
            x: ratio * (p2.x - p1.x) + p1.x,
            y: ratio * (p2.y - p1.y) + p1.y
        });
    };

    // p_0からp_n-1の総距離
    const totalDistance = samplesWithDistances[samplesWithDistances.length - 1].distance;
    // 1点辺りの距離
    const distancePerSample = totalDistance / (interpolatedPoints - (isOpenIntervalRight ? 0 : 1) || 1);
    let sampleIndexLowerBound = 0;

    const result: Point[] = [];

    for (let i = 0; i < interpolatedPoints; i++) {
        const targetDistance = distancePerSample * i;

        while (sampleIndexLowerBound < samplesWithDistances.length - 2 && samplesWithDistances[sampleIndexLowerBound + 1].distance < targetDistance) {
            sampleIndexLowerBound++;
        }

        const p1 = samplesWithDistances[sampleIndexLowerBound];
        const p2 = samplesWithDistances[sampleIndexLowerBound + 1];
        result.push(linearlyInterpolate(p1, p2, targetDistance));
    }
    return result;
}