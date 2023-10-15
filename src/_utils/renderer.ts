import * as THREE from "three";
import {ClientRect, getClientRect} from "@/_utils/rect";

export type WebGLRendererFactory = {
    (canvas: HTMLCanvasElement): THREE.WebGLRenderer
    (canvas: HTMLCanvasElement, rect: ClientRect): THREE.WebGLRenderer
}

export const createWebGLRenderer: WebGLRendererFactory = (canvas: HTMLCanvasElement, clientRect?: ClientRect): THREE.WebGLRenderer => {
    const rect = clientRect ?? getClientRect()

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    })

    // renderer.setClearColor('black')
    renderer.setSize(rect.width, rect.height)
    renderer.setPixelRatio(rect.devicePixelRatio)

    return renderer
}

