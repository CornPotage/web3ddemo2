'use client'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import {useEffect, useRef} from 'react'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
// @ts-ignore
import vertexShader from '@/app/gpu-instancing/instance-buffer-geometory-basics01/shaders/vertex.vert'
// @ts-ignore
import fragmentShader from '@/app/gpu-instancing/instance-buffer-geometory-basics01/shaders/fragment.frag'

import Chance from 'chance'
import {getClientRect} from "@/_utils/rect";
import {createWebGLRenderer} from "@/_utils/renderer";
import * as THREE from "three";

export default function Home() {
  return (
    <main>
     <Canvas />
    </main>
  )
}


const Canvas = () => {

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const numOfGeometry = 10000
    const chance = new Chance()

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) {
            return
        }

        const clientRect = getClientRect()
        const renderer = createWebGLRenderer(canvas)

        const scene = new THREE.Scene()
        scene.add(new THREE.AxesHelper(5))

        const camera = new THREE.PerspectiveCamera(
            70,
            clientRect.width / clientRect.height,
            0.0001,
            20000
        )
        camera.position.z = 50
        camera.lookAt(new THREE.Vector3(0.0, 0.0, 1.0))
        scene.add(camera)
        new OrbitControls(camera, renderer.domElement)

        const originalGeometry = new THREE.TorusGeometry(0.2, 0.1, 8, 25)
        const geometry = new THREE.InstancedBufferGeometry()

        const originalPosition = originalGeometry.attributes.position.clone()
        geometry.setAttribute('position', originalPosition)
        const originalNormal = originalGeometry.attributes.normal.clone()
        geometry.setAttribute('normals', originalNormal)
        const originalUv = originalGeometry.attributes.uv.clone()
        geometry.setAttribute('uv', originalUv)
        const originalIndices = originalGeometry.index?.clone()
        if (originalIndices) {
            geometry.setIndex(originalIndices)
        }

        const instanceOffsetPosition = new THREE.InstancedBufferAttribute(new Float32Array(numOfGeometry * 3), 3)

        for (let i = 0; i < numOfGeometry; i++) {
            const range = {min: -20, max: 20}
            const mid = range.max / 2.0
            const x = chance.floating(range) - mid
            const y = chance.floating(range) - mid
            const z = chance.floating(range) - mid

            instanceOffsetPosition.setXYZ(i, x, y, z)
        }

        geometry.setAttribute('offsetPos', instanceOffsetPosition)

        const uniforms = {
            lightDirection: { type: 'vec3', value: new THREE.Vector3(0, 10, 10) },
            time: { type: 'f', value: 0.0 }
        }

        const material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: uniforms
        })
        const mesh = new THREE.Mesh(geometry, material)

        mesh.position.x += 10
        mesh.position.y += 10

        scene.add(mesh)

        const clock = new THREE.Clock()

        const stats = new Stats()
        document.body.appendChild(stats.dom)

        renderer.setAnimationLoop(() =>{
            mesh.material.uniforms['time'].value += clock.getDelta()

            renderer.render(scene, camera)

            stats.update()
        })

        window.addEventListener('resize', () => {
            const clientRect = getClientRect()
            camera.aspect = clientRect.width / clientRect.height
            camera.updateProjectionMatrix()
            renderer.setSize(clientRect.width, clientRect.height)
            renderer.setPixelRatio(clientRect.devicePixelRatio)

            renderer.render(scene, camera)
            stats.update()
        })
    }, [])

    return (
        <>
            <canvas ref={canvasRef}></canvas>
        </>
    )
}
