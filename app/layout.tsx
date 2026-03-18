import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Steady Steps Music — Online & In-Person Lessons | Boise, ID',
  description:
    'Guitar, bass, piano, voice, music theory, and songwriting lessons for all ages. Online & in-person with Nik in Boise, Idaho. Book a free demo lesson today.',
  keywords: 'music lessons boise idaho, guitar lessons, piano lessons, bass lessons, voice lessons, online music lessons, songwriting lessons, music theory',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
