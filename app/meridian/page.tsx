import type { Metadata } from 'next'
import CityPage from '../components/CityPage'

export const metadata: Metadata = {
  title: 'Music Lessons in Meridian, ID | Guitar, Piano, Voice & More | Steady Steps Music',
  description: 'Expert guitar, bass, piano, voice, music theory, and songwriting lessons in Meridian, Idaho, online or in-person. Taught by Nik, 20+ years experience. Book a free 15-minute demo lesson today.',
  alternates: { canonical: 'https://steadystepsmusic.com/meridian' },
  openGraph: {
    title: 'Music Lessons in Meridian, ID | Steady Steps Music',
    description: 'Guitar, bass, piano, voice, music theory, and songwriting lessons in Meridian, Idaho, online or in-person. Book a free demo lesson today.',
    url: 'https://steadystepsmusic.com/meridian',
    siteName: 'Steady Steps Music',
    locale: 'en_US',
    type: 'website',
  },
}

export default function MeridianPage() {
  return (
    <CityPage
      name="Meridian"
      slug="meridian"
      blurb="Meridian is one of Idaho's fastest-growing communities, full of people who've been meaning to finally learn an instrument. Whether you're a busy parent, a student, or an adult who always wanted to play, lessons are available online or in-person to fit your schedule."
      context="Serving students in Meridian, Eagle, and the surrounding Treasure Valley."
    />
  )
}
