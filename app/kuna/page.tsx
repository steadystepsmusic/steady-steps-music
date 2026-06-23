import type { Metadata } from 'next'
import CityPage from '../components/CityPage'

export const metadata: Metadata = {
  title: 'Music Lessons in Kuna, ID | Guitar, Piano, Voice & More | Steady Steps Music',
  description: 'Expert guitar, bass, piano, voice, music theory, and songwriting lessons in Kuna, Idaho, available online via Zoom. Taught by Nik, 20+ years experience. Book a free 15-minute demo lesson today.',
  alternates: { canonical: 'https://steadystepsmusic.com/kuna' },
  openGraph: {
    title: 'Music Lessons in Kuna, ID | Steady Steps Music',
    description: 'Guitar, bass, piano, voice, music theory, and songwriting lessons in Kuna, Idaho, available online via Zoom. Book a free demo lesson today.',
    url: 'https://steadystepsmusic.com/kuna',
    siteName: 'Steady Steps Music',
    locale: 'en_US',
    type: 'website',
  },
}

export default function KunaPage() {
  return (
    <CityPage
      name="Kuna"
      slug="kuna"
      blurb="Kuna is one of the fastest-growing communities in the Treasure Valley. Music lessons are available to Kuna students of all ages over Zoom, so you can learn from home on a schedule that fits your family, no commute required."
      context="Serving online students in Kuna and across the Treasure Valley via Zoom."
      onlineOnly
    />
  )
}
