export const noteWeight: Record<string, number> = {
    "Normal": 10,
    "Long Start": 10,
    "Long End": 10,
    "Long Mid": 1,
    "Flick": 10,
    "Long End Flick": 10,

    "Normal Critical": 20,
    "Long Start Critical": 20,
    "Long End Critical": 20,
    "Long Mid Critical": 2,
    "Flick Critical": 30,
    "Long End Flick Critical": 30,

    "Long Auto": 1,
    "Long Auto Critical": 1,
}

export function comboWeight(combo: number): number {
    return 1 + Math.min(10, Math.floor((combo - 1) / 100)) / 100;
}

export function levelWeight(level: number): number {
    return 1 + Math.max(0, level - 5) * 0.005;
}

export function eventPoint(score: number, other: number, rate: number, unitRate: number) {
    return Math.floor((100 + Math.floor(score / 20000) + Math.min(7, other / 400000)) * rate / 100 * (100 + unitRate) / 100);
}