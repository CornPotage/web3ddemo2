'use client'

import Link from "next/link";

export default function Home() {
  return (
    <main>
        <ul>
            <li>
                <Link href="/text/basic">TextGeometryの基本</Link>
            </li>
            <li>
                <Link href="/text/basic-shape">FontShapeとShapeGeometryの基本</Link>
            </li>
            <li>
                <Link href="/text/basic-line-shape">FontShapeと文字の線の基本</Link>
            </li>
            <li>
                <Link href="/text/sample-text-with-canvas-2d">Canvas上に表示したテキストをサンプリングする</Link>
            </li>
            <li>
                <Link href="/text/sample-text-with-canvas-texture">CanvasTexture上に表示したテキストをレンダリングする</Link>
            </li>
            <li>
                <Link href="/text/sample-text-with-canvas-texture-particle">CanvasTexture上のテキストをパーティクルでサンプリング</Link>
            </li>
            <li>
                <Link href="/text/sample-text-with-particles">HTMLCanvas上のテキストをパーティクルでサンプリングして表示（元のHTMLCanvas上のテキストの表示はしない）</Link>
            </li>
            <li>
                <Link href="/text/sample-text-with-torus">HTMLCanvas上のテキストをトーラスでサンプリングして表示（InstanceMeshを利用して高速化）</Link>
            </li>
            <li>
                <Link href="/text/sample-image-text-with-canvas-2d">Canvas上に文字の画像を表示する</Link>
            </li>
            <li>
                <Link href="/text/sample-image-text-with-particles">Canvas上にレンダリングした文字の画像をバーティクルでサンプリングする</Link>
            </li>
        </ul>
    </main>
  )
}
