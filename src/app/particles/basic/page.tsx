'use client'

import {useEffect, useMemo, useRef} from 'react'
import * as THREE from 'three'
// @ts-ignore
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import chance from 'chance'

export default function Home() {
  return (
    <main>
     <ParticleScene particleAreaSize={3000} numOfParticles={10000}/>
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

type ParticleSceneProps = {
    numOfParticles: number
    particleAreaSize: number
}
const ParticleScene = ({numOfParticles, particleAreaSize}: ParticleSceneProps) => {

    const canvasRef = useRef<HTMLCanvasElement>(null)

    const particles = useMemo(() => {
        const Random = chance()

        const particlesVertices: number[] = []
        for (let i = 0; i < numOfParticles; i++) {
            const x = particleAreaSize * (Random.floating({min: 0, max: 1}) - 0.5)
            const y = particleAreaSize * (Random.floating({min: 0, max: 1}) - 0.5)
            const z = particleAreaSize * (Random.floating({min: 0, max: 1}) - 0.5)

            particlesVertices.push(x, y, z)
        }

        return particlesVertices
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

        const bufferGeometry = new THREE.BufferGeometry();
        bufferGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particles, 3));
        const pointsMaterial = new THREE.PointsMaterial({
            // 一つ一つのサイズ
            size: 0.8,
            // 色
            color: 0xFFFFFF,
        })
        const mesh = new THREE.Points(bufferGeometry, pointsMaterial);
        scene.add(mesh)

        // ライト
        const pointLight1 = new THREE.PointLight(0xff0040, 1)
        pointLight1.position.set(1, 1, 1)
        const sphere1 = new THREE.SphereGeometry( 0.2, 8, 8 )
        pointLight1.add( new THREE.Mesh( sphere1, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) )
        scene.add(pointLight1)

        const pointLight2 = new THREE.PointLight('lightblue', 1)
        pointLight2.position.set(-1, 1, 0)
        const sphere2 = new THREE.SphereGeometry( 0.05, 8, 8 )
        pointLight2.add( new THREE.Mesh( sphere2, new THREE.MeshBasicMaterial( { color: 'lightblue' } ) ) )
        scene.add(pointLight2)

        const rectLight1 = new THREE.RectAreaLight( 0xffffff, 1000, 40, 100 );
        rectLight1.position.set( 0, 0, 0 );
        const rect1 = new THREE.PlaneGeometry(1, 2)
        rectLight1.add(new THREE.Mesh(rect1, new THREE.MeshBasicMaterial( { color: 0xffffff } )))
        scene.add( rectLight1 )

        const clock = new THREE.Clock()
        const tick = () => {
            const elapsedTime = clock.getElapsedTime()

            pointLight1.position.x = Math.sin( elapsedTime * 0.7 ) * 10;
            pointLight1.position.y = Math.cos( elapsedTime * 0.5 ) * 10;
            pointLight1.position.z = Math.cos( elapsedTime * 0.3 ) * 10;

            pointLight2.position.x = Math.sin( elapsedTime * 0.7 ) * 2;
            pointLight2.position.y = Math.cos( elapsedTime * 0.5 ) * 2;
            pointLight2.position.z = Math.cos( elapsedTime * 0.3 ) * 2;

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
