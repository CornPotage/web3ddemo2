'use client'

import Link from "next/link";
export default function Home() {
  return (
    <main>
        <ul>
            <li>
                <Link href="/particles">Particle Examples</Link>
            </li>
            <li>
                <Link href="/text">Text Example</Link>
            </li>
            <li>
                <Link href="/gpu-instancing">GPU Instancing Example</Link>
            </li>
            <li>
                <Link href="/mouse-actions">マウス操作と連動したExample</Link>
            </li>
        </ul>
    </main>
  )
}
