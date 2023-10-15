'use client'

import {useEffect, useMemo, useRef} from 'react'
import * as THREE from 'three'
// @ts-ignore
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import chance from 'chance'
import {range} from "@/_utils/collections";

export default function Home() {
  return (
    <main>
     <Canvas />
    </main>
  )
}

const getClientRect = () => {
    return {
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
    }
}
const Canvas = () => {
    const numParticles = 10000
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const particles = useMemo(() => {
        const Random = chance()
        const particleRange = range(numParticles)

        return particleRange.map(() => {
            const time = Random.integer({min: 0, max: 5})
            const factor = Random.integer({min: 20, max: 120})
            const speed = Random.floating({min: 0.01, max: 0.015}) / 3.0

            const x = Random.integer({min: -50, max: 50})
            const y = Random.integer({min: -50, max: 50})
            const z = Random.integer({min: -50, max: 50})

            return {
                time,
                factor,
                speed,
                x,
                y,
                z,
            }
        })
    }, [])

    const tempThreeObject = useMemo(() => new THREE.Object3D(), [])

    useEffect(() => {
        if (!canvasRef.current) {
            return
        }
        const clientRect = getClientRect()

        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true,
            alpha: true
        })
        renderer.setClearColor('black')
        renderer.setSize(clientRect.width, clientRect.height)
        renderer.setPixelRatio(clientRect.devicePixelRatio)

        const scene = new THREE.Scene()
        scene.add(new THREE.AxesHelper(5))

        const camera = new THREE.PerspectiveCamera(
            75,
            clientRect.width / clientRect.height,
            0.1,
            10000
        )
        camera.position.z = 10
        scene.add(camera)
        new OrbitControls(camera, renderer.domElement)

        const dodecahedronGeometry = new THREE.DodecahedronGeometry(0.2, 0)
        const meshPhongMaterial = new THREE.MeshPhongMaterial({color: 'white'});
        const instancedMesh = new THREE.InstancedMesh(dodecahedronGeometry, meshPhongMaterial, numParticles)
        scene.add(instancedMesh);

        // ライト

        {
            const pointLight = new THREE.PointLight(0xff0040, 400)
            pointLight.position.set(1, 1, 0)
            const sphere = new THREE.SphereGeometry( 0.05, 8, 8 )
            pointLight.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
            scene.add(pointLight)
        }

        {
            const pointLight = new THREE.PointLight('lightblue', 800)
            pointLight.position.set(-1, 1, 0)
            const sphere = new THREE.SphereGeometry( 0.05, 8, 8 )
            pointLight.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 'lightblue' } ) ) );
            scene.add(pointLight)
        }

        {
            const rectLight1 = new THREE.RectAreaLight( 0xff0000, 500, 4, 10 );
            rectLight1.position.set( - 5, 5, 5 );
            scene.add( rectLight1 );
        }

        const tick = () => {
            particles.forEach((particle, index) => {
                const { factor, speed, x, y, z} = particle

                const t = (particle.time += speed)
                tempThreeObject.position.set(
                    x + Math.cos((t / 10) * factor) + (Math.sin(t) * factor) / 10,
                    y + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
                    z + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10,
                )

                const s = Math.cos(t)
                tempThreeObject.scale.set(s, s, s)
                tempThreeObject.rotation.set(s * 5, s * 5, s * 5)
                tempThreeObject.updateMatrix()

                instancedMesh.setMatrixAt(index, tempThreeObject.matrix)
            })
            instancedMesh.instanceMatrix.needsUpdate = true

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
            <canvas id="canvas" ref={canvasRef}></canvas>
        </>
    )
}
