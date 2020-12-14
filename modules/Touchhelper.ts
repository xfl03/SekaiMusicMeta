export interface TouchEvent {
    position: string,
    start: boolean,
    time: number,
}

export const comparator = (a: TouchEvent, b: TouchEvent) => a.time - b.time;