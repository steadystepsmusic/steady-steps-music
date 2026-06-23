import type { Metadata } from 'next'
import CityPage from '../components/CityPage'

export const metadata: Metadata = {
  title: 'Music Lessons in Caldwell, ID | Guitar, Piano, Voice & More | Steady Steps Music',
  description: 'Expert guitar, bass, piano, voice, music theory, and songwriting lessons in Caldwell, Idaho, available online via Zoom. Taught by Nik, 20+ years experience. Book a free 15-minute demo lesson today.',
  alternates: { canonical: 'https://steadystepsmusic.com/caldwell' },
  openGraph: {
    title: 'Music Lessons in Caldwell, ID | Steady Steps Music',
    description: 'Guitar, bass, piano, voice, music theory, and songwriting lessons in Caldwell, Idaho, available online via Zoom. Book a free demo lesson today.',
    url: 'https://steadystepsmusic.com/caldwell',
    siteName: 'Steady Steps Music',
    locale: 'en_US',
    type: 'website',
  },
}

export default function CaldwellPage() {
  return (
    <CityPage
      name="Caldwell"
      slug="caldwell"
      blurb="Caldwell is home to a vibrant, growing community in Canyon County. Music lessons are available to Caldwell students of all ages over Zoom, so you can learn from home on a schedule that fits your family, no commute required."
      context="Serving online students in Caldwell and across the Treasure Valley via Zoom."
      onlineOnly
    />
  )
}
