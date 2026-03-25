import type { Metadata } from 'next'
import CityPage from '../components/CityPage'

export const metadata: Metadata = {
  title: 'Music Lessons in Eagle, ID | Guitar, Piano, Voice & More | Steady Steps Music',
  description: 'Expert guitar, bass, piano, voice, music theory, and songwriting lessons in Eagle, Idaho — online or in-person. Taught by Nik, 20+ years experience. Book a free 15-minute demo lesson today.',
  alternates: { canonical: 'https://steadystepsmusic.com/eagle' },
  openGraph: {
    title: 'Music Lessons in Eagle, ID | Steady Steps Music',
    description: 'Guitar, bass, piano, voice, music theory, and songwriting lessons in Eagle, Idaho — online or in-person. Book a free demo lesson today.',
    url: 'https://steadystepsmusic.com/eagle',
    siteName: 'Steady Steps Music',
    locale: 'en_US',
    type: 'website',
  },
}

export default function EaglePage() {
  return (
    <CityPage
      name="Eagle"
      slug="eagle"
      blurb="Eagle is a tight-knit community with a strong tradition of family and the arts. Music lessons are a great fit for Eagle students of all ages — from kids picking up their first guitar to adults finally making time for something they love. Online and in-person options available."
      context="Serving students in Eagle, Meridian, and the surrounding Treasure Valley."
    />
  )
}
