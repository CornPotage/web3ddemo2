'use client'

import Link from "next/link";

export default function Home() {
  return (
    <main>
        <ul>
            <li>
                <Link href="/particles/basic">基本</Link>
            </li>
            <li>
                <Link href="/particles/instance-mesh">InstanceMesh</Link>
            </li>
        </ul>
    </main>
  )
}
