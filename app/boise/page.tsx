import type { Metadata } from 'next'
import CityPage from '../components/CityPage'
import { OG_IMAGE } from '../site'

export const metadata: Metadata = {
  title: 'Music Lessons in Boise, ID | Guitar, Piano, Voice & More | Steady Steps Music',
  description: 'Expert guitar, bass, piano, voice, music theory, and songwriting lessons in Boise, Idaho, online or in-person. Taught by Nik, 20+ years experience. Book a free 15-minute demo lesson today.',
  alternates: { canonical: 'https://steadystepsmusic.com/boise' },
  openGraph: {
    title: 'Music Lessons in Boise, ID | Steady Steps Music',
    description: 'Guitar, bass, piano, voice, music theory, and songwriting lessons in Boise, Idaho, online or in-person. Book a free demo lesson today.',
    url: 'https://steadystepsmusic.com/boise',
    siteName: 'Steady Steps Music',
    locale: 'en_US',
    type: 'website',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Music Lessons in Boise, ID | Steady Steps Music',
    description: 'Guitar, bass, piano, voice, music theory, and songwriting lessons in Boise, Idaho, online or in-person. Book a free demo lesson today.',
  },
}

export default function BoisePage() {
  return (
    <CityPage
      name="Boise"
      slug="boise"
      blurb="Boise has a big live music scene, from downtown venues to Treefort, and plenty of people who've been meaning to finally learn an instrument. Whether you're a parent looking for lessons for your kid or an adult who always wanted to play, lessons are available online or in-person around Boise."
      context="Serving students in Boise, Garden City, Meridian, Eagle, and the surrounding Treasure Valley."
    />
  )
}
