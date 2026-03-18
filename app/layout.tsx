import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Music Lessons in Boise, ID | Guitar, Piano, Voice & More | Steady Steps Music',
  description:
    'Expert guitar, bass, piano, voice, music theory, and songwriting lessons in Boise, Idaho — online or in-person. Taught by Nik, 20+ years experience. Book a free 15-minute demo lesson today. All skill levels welcome.',
  keywords: 'music lessons boise idaho, guitar lessons boise, piano lessons boise, voice lessons boise, bass lessons boise, online music lessons, songwriting lessons, music theory lessons, music teacher boise, beginner guitar lessons, adult music lessons boise, kids music lessons boise',
  openGraph: {
    title: 'Music Lessons in Boise, ID | Steady Steps Music',
    description: 'Guitar, bass, piano, voice, music theory, and songwriting lessons — online or in-person with Nik in Boise, Idaho. Book a free demo lesson today.',
    url: 'https://steadystepsmusic.com',
    siteName: 'Steady Steps Music',
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
