import {useEffect, useState} from "react"
import * as THREE from 'three'
import {WebGLRendererParameters} from "three/src/renderers/WebGLRenderer.js"

// https://blog.kimizuka.org/entry/2023/01/10/225553
export const useThreejs = (canvas: HTMLCanvasElement | null, parameters?: WebGLRendererParameters) => {
    const [renderer, setRenderer] = useState<THREE.WebGLRenderer>()

    useEffect(() => {
        if (!canvas) {
            return
        }

        const renderParams = parameters ?? {
            antialias: true,
            alpha: true,
        }
        setRenderer(new THREE.WebGLRenderer(renderParams))
    }, [canvas, parameters])

    return { THREE, renderer }
}