'use client'

import {useEffect, useMemo, useRef} from 'react'
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {getClientRect} from "@/_utils/rect";
import {createWebGLRenderer} from "@/_utils/renderer";

// https://codesandbox.io/s/03-demo--typing-effects-with-webgl-tutorial-pq00h2?from-embed=&file=/src/index.js:4279-4284

export default function Home() {
    return (
        <main>
            <TextCanvas />
        </main>
    )
}

type TextureCoordinate = {
    x: number
    y: number
}
const TextCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const createRenderCanvas = () => {
        const canvas = document.createElement('canvas')
        canvas.width = canvas.height = 0
        return canvas
    }

    const createSamplingCoordinates = (textureCanvas: HTMLCanvasElement) => {
        const textureFontSize = 70
        const textureFontName = 'Noto Sans JP'
        const textureFont = `${textureFontSize}px ${textureFontName}`
        const lines = [
            'ステーキハウスほし',
            'Sampling Texture',
            'in HTML Canvas',
        ]
        const lineMaxLength = [...lines].sort((a, b) => b.length - a.length)[0].length
        const textureWidth = textureFontSize * 0.9 * lineMaxLength
        const textureHeight = textureFontSize * lines.length

        const textureCanvasContext = textureCanvas.getContext('2d')
        if (!textureCanvasContext) {
            return
        }

        textureCanvas.width = textureWidth
        textureCanvas.height = textureHeight
        textureCanvasContext.font = textureFont
        textureCanvasContext.fillStyle = '#2a9d8f'

        textureCanvasContext.clearRect(0, 0, textureCanvas.width, textureCanvas.height)
        lines.forEach((line, index) => {
            textureCanvasContext.fillText(line, 0, (index + 0.9) * textureFontSize)
        })

        const imageData = textureCanvasContext.getImageData(0, 0, textureCanvas.width, textureCanvas.height)
        const imageClamps = imageData.data

        const textureCoordinates : TextureCoordinate[] = []

        for (let i = 0; i < textureCanvas.height; i++) {
            for (let j = 0; j < textureCanvas.width; j++) {
                if (imageClamps[(j + i * textureCanvas.width) * 4] > 0) {
                    textureCoordinates.push({
                        x: j,
                        y: i,
                    })
                }
            }
        }

        return textureCoordinates
    }

    useEffect(() => {
        if (!canvasRef.current) {
            return
        }
        const clientRect = getClientRect()

        const renderer = createWebGLRenderer(canvasRef.current)
        renderer.setClearColor('white')

        const scene = new THREE.Scene()

        const camera = new THREE.PerspectiveCamera(
            45,
            clientRect.width / clientRect.height,
            0.1,
            10000
        )
        camera.position.z = 1000
        scene.add(camera)
        const orbit = new OrbitControls(camera, renderer.domElement)
        // orbit.maxDistance = 900
        orbit.enablePan = true

        const textureCanvas = createRenderCanvas()

        createSamplingCoordinates(textureCanvas)

        const canvasTexture = new THREE.CanvasTexture(textureCanvas)
        const planeGeometry = new THREE.PlaneGeometry(textureCanvas.width, textureCanvas.height)
        const meshBasicMaterial = new THREE.MeshBasicMaterial({
            map: canvasTexture
        })
        const planeMesh = new THREE.Mesh(planeGeometry, meshBasicMaterial);
        scene.add(planeMesh)

        const tick = () => {
            window.requestAnimationFrame(tick)
            renderer.render(scene, camera)
        }
        tick()

        window.addEventListener('resize', () => {
            const clientRect = getClientRect()

            camera.aspect = clientRect.width / clientRect.height
            camera.updateProjectionMatrix()
            renderer.setSize(clientRect.width, clientRect.height)
            renderer.setPixelRatio(clientRect.devicePixelRatio)

            renderer.render(scene, camera)
        })
    }, [])
    return (
        <>
            <div>
                <canvas ref={canvasRef}></canvas>
            </div>
        </>
    )
}
