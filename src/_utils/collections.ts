
export type Range = {
    (end: number): number[]
    (start: number, end: number): number[]
}
export const range: Range = (r1: number, r2?: number): number[] => {
    if (r2 !== undefined) {
        return _range(r1, r2)
    } else {
        return _range(0, r1)
    }
}

const _range = (start: number, end: number): number[] => {
    if (start > end) {
        throw new Error('Error: start is larger than end.')
    }
    const length = end + 1
    const N = length - start

    return Array(N).fill(0, 0, length).map((_, i: number) => start + i)
}