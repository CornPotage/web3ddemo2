'use client'

import {useEffect, useRef} from 'react'
import {loadImage} from "@/_utils/images";

// https://liginc.co.jp/566196
// https://codepen.io/hisamikurita/pen/JjJpKdZ

export default function Home() {
    return (
        <main>
            <TextCanvas />
        </main>
    )
}

const TextCanvas = () => {

    const canvasRef = useRef<HTMLCanvasElement>(null)

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

    useEffect(() => {
        if (!canvasRef.current) {
            return
        }

        const imageCanvas = canvasRef.current;
        const imageFilePath = '/text/sample-image-text-with-canvas-2d/sample.png';
        (async () => {
            await renderImage(imageFilePath, imageCanvas)
        })()

    }, [])
    return (
        <>
            <canvas ref={canvasRef}></canvas>
        </>
    )
}
