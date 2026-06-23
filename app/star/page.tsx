import type { Metadata } from 'next'
import CityPage from '../components/CityPage'

export const metadata: Metadata = {
  title: 'Music Lessons in Star, ID | Guitar, Piano, Voice & More | Steady Steps Music',
  description: 'Expert guitar, bass, piano, voice, music theory, and songwriting lessons in Star, Idaho, available online via Zoom. Taught by Nik, 20+ years experience. Book a free 15-minute demo lesson today.',
  alternates: { canonical: 'https://steadystepsmusic.com/star' },
  openGraph: {
    title: 'Music Lessons in Star, ID | Steady Steps Music',
    description: 'Guitar, bass, piano, voice, music theory, and songwriting lessons in Star, Idaho, available online via Zoom. Book a free demo lesson today.',
    url: 'https://steadystepsmusic.com/star',
    siteName: 'Steady Steps Music',
    locale: 'en_US',
    type: 'website',
  },
}

export default function StarPage() {
  return (
    <CityPage
      name="Star"
      slug="star"
      blurb="Star is a growing community on the western edge of the Treasure Valley. Music lessons are available to Star students of all ages over Zoom, so you can learn from home on a schedule that fits your family, no commute required."
      context="Serving online students in Star and across the Treasure Valley via Zoom."
      onlineOnly
    />
  )
}
