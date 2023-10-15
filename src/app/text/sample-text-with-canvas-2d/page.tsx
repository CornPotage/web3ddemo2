'use client'

import {useEffect, useMemo, useRef} from 'react'

// https://codesandbox.io/s/01-demo--typing-effects-with-webgl-tutorial-ps1gg5?file=/src/index.js:2156-2162

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

    const textureFontSize = 70
    const textureFontName = 'Noto Sans JP'
    const textureFont = `${textureFontSize}px ${textureFontName}`
    const lines = [
        'ステーキハウスほし',
        'Sampling Texture',
        'in HTML Canvas',
    ]
    const lineMaxLength = [...lines].sort((a, b) => b.length - a.length)[0].length
    const textureWidth = textureFontSize * lineMaxLength
    const textureHeight = textureFontSize * lines.length

    const sampleStep = 4

    const textureCanvasRef = useRef<HTMLCanvasElement>(null)
    const dotCanvasRef = useRef<HTMLCanvasElement>(null)

    const textureCoordinates = useMemo<TextureCoordinate[]>(() => [], [])

    useEffect(() => {
        if (!textureCanvasRef.current || !dotCanvasRef.current) {
            return
        }

        const textureCanvas = textureCanvasRef.current
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
        const step = sampleStep > 0 ? sampleStep : 1

        for (let i = 0; i < textureCanvas.height; i += step) {
            for (let j = 0; j < textureCanvas.width; j += step) {
                if (imageClamps[(j + i * textureCanvas.width) * 4] > 0) {
                    textureCoordinates.push({
                        x: j,
                        y: i,
                    })
                }
            }
        }

        const dotCanvas = dotCanvasRef.current
        const dotCanvasContext = dotCanvas.getContext('2d')
        if (!dotCanvasContext) {
            return
        }

        dotCanvas.width = textureWidth
        dotCanvas.height = textureHeight
        dotCanvasContext.font = textureFont
        dotCanvasContext.fillStyle = '#ff0000'

        dotCanvasContext.clearRect(0, 0, dotCanvas.width, dotCanvas.height)

        for (const coordinate of textureCoordinates) {
            dotCanvasContext.beginPath()

            dotCanvasContext.arc(
                coordinate.x,
                coordinate.y,
                1,
                0,
                Math.PI * 2,
                true
            )

            dotCanvasContext.closePath()
            dotCanvasContext.fill()
        }

    }, [])
    return (
        <>
            <div>
                <canvas ref={textureCanvasRef}></canvas>
            </div>
            <div>
                <canvas ref={dotCanvasRef}></canvas>
            </div>
        </>
    )
}
