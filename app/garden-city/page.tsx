import type { Metadata } from 'next'
import CityPage from '../components/CityPage'

export const metadata: Metadata = {
  title: 'Music Lessons in Garden City, ID | Guitar, Piano, Voice & More | Steady Steps Music',
  description: 'Expert guitar, bass, piano, voice, music theory, and songwriting lessons in Garden City, Idaho, online or in-person. Taught by Nik, 20+ years experience. Book a free 15-minute demo lesson today.',
  alternates: { canonical: 'https://steadystepsmusic.com/garden-city' },
  openGraph: {
    title: 'Music Lessons in Garden City, ID | Steady Steps Music',
    description: 'Guitar, bass, piano, voice, music theory, and songwriting lessons in Garden City, Idaho, online or in-person. Book a free demo lesson today.',
    url: 'https://steadystepsmusic.com/garden-city',
    siteName: 'Steady Steps Music',
    locale: 'en_US',
    type: 'website',
  },
}

export default function GardenCityPage() {
  return (
    <CityPage
      name="Garden City"
      slug="garden-city"
      blurb="Garden City sits right along the Boise River Greenbelt with a creative, artistic vibe that makes it a natural home for music. If you've been thinking about starting lessons, there's no better time. Online and in-person options available for all ages and skill levels."
      context="Serving students in Garden City, Boise, and the surrounding area."
    />
  )
}
