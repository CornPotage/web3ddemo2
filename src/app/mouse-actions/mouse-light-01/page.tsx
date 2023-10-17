'use client'

import {useEffect, useMemo, useRef} from 'react'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {getClientRect} from "@/_utils/rect";
import {createWebGLRenderer} from "@/_utils/renderer";

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
        const clientRect = getClientRect()

        const renderer = createWebGLRenderer(canvasRef.current)
        // renderer.setClearColor('black')


        const scene = new THREE.Scene()
        scene.add(new THREE.AxesHelper(5))

        const fov = 60
        const fovRed = (fov / 2) * (Math.PI / 180) // ラジアンに変換
        const cameraDistance = (clientRect.height / 2) / Math.tan(fovRed)

        const camera = new THREE.PerspectiveCamera(
            fov,
            clientRect.width / clientRect.height,
            1,
            cameraDistance * 2
        )
        console.log('cameraDistance', cameraDistance)
        camera.position.z = cameraDistance
        scene.add(camera)
        new OrbitControls(camera, renderer.domElement)

        const geometry = new THREE.BoxGeometry(300, 300, 300)
        const material = new THREE.MeshLambertMaterial({ color: 0xffffff })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.rotation.x = Math.PI / 4
        mesh.rotation.y = Math.PI / 4
        scene.add(mesh)

        // ライト
        const light = new THREE.PointLight(0x00ffff, 2, 0, 0.15 )
        light.position.set(0, 0, 400)
        const sphere1 = new THREE.SphereGeometry( 10, 32, 32 )
        light.add( new THREE.Mesh( sphere1, new THREE.MeshBasicMaterial( { color: 0x00ffff } ) ) )
        scene.add(light)

        const tick = () => {
            window.requestAnimationFrame(tick)
            renderer.render(scene, camera)
        }
        tick()

        const mousePosition = new THREE.Vector2()
        const mouseMoved = (x: number, y: number) => {
            const clientRect = getClientRect()

            mousePosition.x = x - (clientRect.width / 2)
            mousePosition.y = -y + (clientRect.height / 2)

            light.position.x = mousePosition.x
            light.position.y = mousePosition.y
        }

        window.addEventListener('mousemove', e => {
            mouseMoved(e.clientX, e.clientY);
        });

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
            <canvas ref={canvasRef}></canvas>
        </>
    )
}
