'use client'

import {useEffect, useMemo, useRef} from 'react'
import * as THREE from 'three'

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'

import chance from 'chance'
import {getClientRect} from "@/_utils/rect";
import {createWebGLRenderer} from "@/_utils/renderer";
import {loadFont} from "@/_utils/font";

export default function Home() {
  return (
    <main>
     <Canvas />
    </main>
  )
}


const Canvas = () => {

    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!canvasRef.current) {
            return
        }

        (async () => {
            const clientRect = getClientRect()
            // @ts-ignore
            const renderer = createWebGLRenderer(canvasRef.current)

            const scene = new THREE.Scene()
            scene.add(new THREE.AxesHelper(5))

            const camera = new THREE.PerspectiveCamera(
                30,
                clientRect.width / clientRect.height,
                0.1,
                1500
            )
            camera.position.z = 20
            scene.add(camera)
            new OrbitControls(camera, renderer.domElement)

            const font = await loadFont("/fonts/NotoSansJP_Regular.json")
            const fontShape = font.generateShapes('ステーキハウスほし', 1)
            const shapeGeometry = new THREE.ShapeGeometry(fontShape)
            shapeGeometry.center()
            shapeGeometry.computeBoundingBox()

            const meshToonMaterial = new THREE.MeshToonMaterial({color: 0x6699FF})
            const mesh = new THREE.Mesh(shapeGeometry, meshToonMaterial)
            scene.add(mesh)

            // ライト
            const dirLight1 = new THREE.DirectionalLight( 0xffffff, 8 )
            dirLight1.position.set( 0, 0, 1 ).normalize();
            scene.add(dirLight1);

            const clock = new THREE.Clock()
            const tick = () => {
                const elapsedTime = clock.getElapsedTime()

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
        })()
    }, [])
    return (
        <>
            <canvas id="canvas" ref={canvasRef}></canvas>
        </>
    )
}
