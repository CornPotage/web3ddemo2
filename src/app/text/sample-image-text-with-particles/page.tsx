'use client'

import {useEffect, useMemo, useRef, useState} from 'react'
import {loadImage} from "@/_utils/images";
import {createWebGLRenderer} from "@/_utils/renderer";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {ClientRect, getClientRect} from "@/_utils/rect";
import Chance from 'chance'
import {
    imageCanvasClass,
    threejsCanvasClass
} from "@/app/text/sample-image-text-with-particles/Canvas.css";

// https://liginc.co.jp/566196
// https://codepen.io/hisamikurita/pen/JjJpKdZ
// https://qiita.com/pentamania/items/f8fc565aebae8fb79790

export default function Home() {
    return (
        <main>
            <TextCanvas/>
        </main>
    )
}

// three.js で扱いやすくした頂点情報
type SamplingImageVertices = {
    position: number[]
    color: number[]
    alpha: number[]
}


type SamplingPosition = {
    x: number
    y: number
    z: number
}
const TextCanvas = () => {

    const imageCanvasRef = useRef<HTMLCanvasElement>(null)
    const threejsCanvasRef = useRef<HTMLCanvasElement>(null)
    const tempThreeObject = useMemo(() => new THREE.Object3D(), [])
    const chance = new Chance()
    const [isInitialized, setIsInitialized] = useState(false)

    const renderImage = async (imageFilePath: string, canvas: HTMLCanvasElement) => {
        const canvasContext = canvas.getContext('2d')
        if (!canvasContext) {
            throw Error('Canvas Context is null.')
        }

        const img = await loadImage(imageFilePath)

        const width = img.width
        const height = img.height
        canvas.width = width
        canvas.height = height

        canvasContext.clearRect(0, 0, width, height)
        canvasContext.drawImage(img, 0, 0)
    }

    const sampleFromCanvas = (canvas: HTMLCanvasElement): SamplingImageVertices => {
        const canvasContext = canvas.getContext('2d', {willReadFrequently: true})
        if (!canvasContext) {
            throw Error('Canvas Context is null.')
        }

        const position: number[] = []
        const color: number[] = []
        const alpha: number[] = []

        const width = canvas.width
        const height = canvas.height
        const imageData = canvasContext.getImageData(0, 0, width, height).data

        const samplingRatio = 1
        for (let y = 0; y < height; y += samplingRatio) {
            for (let x = 0; x < width; x += samplingRatio) {
                const index = (y * width + x) * 4

                if (imageData[index + 3] === 0) {
                    // getImageDataしたデータの場合、透過ピクセルのalphaチャンネルが0になる
                    continue
                }
                const r = imageData[index] / 255
                const g = imageData[index + 1] / 255
                const b = imageData[index + 2] / 255
                const a = imageData[index + 3] / 255

                const sX = (x - width / 2) + chance.floating({min: -0.5, max: 0.5}) // 中央よせ
                const sY = -(y - height / 2) + chance.floating({min: -0.5, max: 0.5}) //中央よせ & Y軸の方向をThree.jsに合わせる
                const sZ = chance.floating({min: -1.5, max: 1.5})

                position.push(sX, sY, sZ)
                color.push(r, g, b)
                alpha.push(a)
            }
        }

        return {
            position: position,
            color: color,
            alpha: alpha,
        }
    }

    useEffect(() => {
        const imageFilePath = '/text/sample-image-text-with-canvas-2d/sample.png';
        (async () => {
            if (!imageCanvasRef.current || !threejsCanvasRef.current) {
                return
            }

            const imageCanvas = imageCanvasRef.current
            await renderImage(imageFilePath, imageCanvas)

            const samplingImagePositions = sampleFromCanvas(imageCanvas)
            if (samplingImagePositions.position.length === 0) {
                return
            }

            const clientRect: ClientRect = {
                width: imageCanvas.width,
                height: imageCanvas.height,
                devicePixelRatio: window.devicePixelRatio
            }

            const renderer = createWebGLRenderer(threejsCanvasRef.current, clientRect)

            const scene = new THREE.Scene()

            const camera = new THREE.PerspectiveCamera(
                45,
                clientRect.width / clientRect.height,
                // 480 / 360,
                0.1,
                10000
            )
            camera.position.set(0, 0, 300)
            scene.add(camera)
            const orbit = new OrbitControls(camera, renderer.domElement)
            orbit.enablePan = false

            const geometry = new THREE.BufferGeometry();
            const position = new THREE.BufferAttribute(new Float32Array(samplingImagePositions.position), 3);
            const color = new THREE.BufferAttribute(new Float32Array(samplingImagePositions.color), 3);
            const alpha = new THREE.BufferAttribute(new Float32Array(samplingImagePositions.alpha), 1);
            geometry.setAttribute('position', position);
            geometry.setAttribute('color', color);
            geometry.setAttribute('alpha', alpha);

            const material = new THREE.PointsMaterial({
                // 一つ一つのサイズ
                size: 1.8,
                vertexColors: true,
                transparent: true,
            })
            const mesh = new THREE.Points(geometry, material);
            scene.add(mesh)
            const tick = () => {
                window.requestAnimationFrame(tick)
                renderer.render(scene, camera)
            }
            tick()

            window.addEventListener('resize', () => {
                const clientRect: ClientRect = {
                    width: imageCanvas.width,
                    height: imageCanvas.height,
                    devicePixelRatio: window.devicePixelRatio
                }

                camera.aspect = clientRect.width / clientRect.height
                // camera.aspect = 480 / 360
                camera.updateProjectionMatrix()
                renderer.setSize(clientRect.width, clientRect.height)
                // renderer.setSize(480, 360)
                renderer.setPixelRatio(clientRect.devicePixelRatio)

                renderer.render(scene, camera)
            })
        })()
    }, [])
    return (
        <>
            <div>
                <canvas className={imageCanvasClass} ref={imageCanvasRef}></canvas>
            </div>
            <div>
                <canvas className={threejsCanvasClass} ref={threejsCanvasRef}></canvas>
            </div>
        </>
    )
}
