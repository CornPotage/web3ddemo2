'use client'

import {useEffect, useMemo, useRef} from 'react'
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {getClientRect} from "@/_utils/rect";
import {createWebGLRenderer} from "@/_utils/renderer";

// https://codesandbox.io/s/04-demo--typing-effects-with-webgl-tutorial-w8lh9i?file=/src/index.js:2264-2279

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

    const renderText = (textureCanvas: HTMLCanvasElement) => {
        const textureFontSize = 70
        const textureFontName = 'Noto Sans JP'
        const textureFont = `${textureFontSize}px ${textureFontName}`
        const lines = [
            'ステーキハウスほし',
            'エクストラバージンオリーブオイル',
            '米食いたい',
        ]
        const lineMaxLength = [...lines].sort((a, b) => b.length - a.length)[0].length
        const textureWidth = textureFontSize * lineMaxLength
        const textureHeight = textureFontSize * lines.length

        const textureCanvasContext = textureCanvas.getContext('2d')
        if (!textureCanvasContext) {
            throw Error('Canvas Context is null')
        }

        textureCanvas.width = textureWidth
        textureCanvas.height = textureHeight
        textureCanvasContext.font = textureFont
        textureCanvasContext.fillStyle = '#2a9d8f'

        textureCanvasContext.clearRect(0, 0, textureCanvas.width, textureCanvas.height)
        lines.forEach((line, index) => {
            textureCanvasContext.fillText(line, 0, (index + 0.9) * textureFontSize)
        })
    }

    const sampleCoordinates = (textureCanvas: HTMLCanvasElement) => {
        const textureCanvasContext = textureCanvas.getContext('2d')
        if (!textureCanvasContext) {
            throw Error('Canvas Context is null')
        }

        const imageData = textureCanvasContext.getImageData(0, 0, textureCanvas.width, textureCanvas.height)
        const imageClamps = imageData.data

        const textureCoordinates : TextureCoordinate[] = []

        const sampleStep = 1
        for (let i = 0; i < textureCanvas.height; i += sampleStep) {
            for (let j = 0; j < textureCanvas.width; j += sampleStep) {
                if (imageClamps[(j + i * textureCanvas.width) * 4] > 0) {
                    textureCoordinates.push({
                        x: j,
                        y: i,
                    })
                }
            }
        }

        const fontScaleFactor = 0.5;
        textureCoordinates.map((c) => {
            return { x: c.x * fontScaleFactor, y: c.y * fontScaleFactor}
        })
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
        camera.position.set(0, 0, 1000)
        scene.add(camera)
        const orbit = new OrbitControls(camera, renderer.domElement)
        orbit.enablePan = false

        const textureCanvas = createRenderCanvas()
        renderText(textureCanvas)

        const coordinates = sampleCoordinates(textureCanvas)

        const sceneWidth = coordinates.map((c) => c.x).sort((a, b) => b - a)[0]
        const sceneHeight = coordinates.map((c) => c.y).sort((a, b) => b - a)[0]

        const geometry = new THREE.BufferGeometry()
        const material = new THREE.PointsMaterial({
            color: 0xff0000,
            size: 3
        })

        const vertices = []
        for (const coordinate of coordinates) {
            vertices.push(
                coordinate.x + (4 * Math.random()),
                (sceneHeight - coordinate.y) + (4 * Math.random()),
                10 * Math.random()
            )
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
        const mesh = new THREE.Points(geometry, material)
        scene.add(mesh)

        mesh.position.x = -0.5 * sceneWidth
        mesh.position.y = -0.5 * sceneHeight

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
