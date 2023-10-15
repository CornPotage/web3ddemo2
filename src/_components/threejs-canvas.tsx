'use client'

import { StrictMode } from 'react'
import { Canvas, Props as FiberCanvasProps } from '@react-three/fiber'
import { style } from '@vanilla-extract/css';


const styleFull = style({
    width: '100vw',
    height: '100vh'
})

export interface ThreejsCanvasProps extends FiberCanvasProps {}

const ThreejsCanvas = ({children, ...props }: ThreejsCanvasProps) => {
    return (
        <>
            <div className={styleFull}>
                <StrictMode>
                    <Canvas
                        {...props}
                    >
                        {children}
                    </Canvas>
                </StrictMode>
            </div>
        </>
    )
}

export default ThreejsCanvas
