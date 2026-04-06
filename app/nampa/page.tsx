import type { Metadata } from 'next'
import CityPage from '../components/CityPage'

export const metadata: Metadata = {
  title: 'Music Lessons in Nampa, ID | Guitar, Piano, Voice & More | Steady Steps Music',
  description: 'Expert guitar, bass, piano, voice, music theory, and songwriting lessons in Nampa, Idaho, online or in-person. Taught by Nik, 20+ years experience. Book a free 15-minute demo lesson today.',
  alternates: { canonical: 'https://steadystepsmusic.com/nampa' },
  openGraph: {
    title: 'Music Lessons in Nampa, ID | Steady Steps Music',
    description: 'Guitar, bass, piano, voice, music theory, and songwriting lessons in Nampa, Idaho, online or in-person. Book a free demo lesson today.',
    url: 'https://steadystepsmusic.com/nampa',
    siteName: 'Steady Steps Music',
    locale: 'en_US',
    type: 'website',
  },
}

export default function NampaPage() {
  return (
    <CityPage
      name="Nampa"
      slug="nampa"
      blurb="Nampa is Canyon County's largest city and home to students of all backgrounds and musical interests. Whether you want to play for fun, perform, or just finally understand how music works, lessons are tailored to your goals, available online or in-person."
      context="Serving students in Nampa, Caldwell, and the greater Treasure Valley."
    />
  )
}
