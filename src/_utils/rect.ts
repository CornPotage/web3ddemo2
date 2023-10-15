
export type ClientRect = {
    width: number
    height: number
    devicePixelRatio: number
}
export const getClientRect = (): ClientRect => {
    return {
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
    }
}