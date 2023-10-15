
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Web 3D demo 2',
  description: 'だよ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
