import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Music Lessons in Boise, ID | Guitar, Piano, Voice & More | Steady Steps Music',
  description:
    'Expert guitar, bass, piano, voice, music theory, and songwriting lessons in Boise, Idaho — online or in-person. Taught by Nik, 20+ years experience. Book a free 15-minute demo lesson today. All skill levels welcome.',
  keywords: 'music lessons boise idaho, guitar lessons boise, piano lessons boise, voice lessons boise, bass lessons boise, online music lessons, songwriting lessons, music theory lessons, music teacher boise, beginner guitar lessons, adult music lessons boise, kids music lessons boise',
  metadataBase: new URL('https://steadystepsmusic.com'),
  alternates: {
    canonical: 'https://steadystepsmusic.com',
  },
  openGraph: {
    title: 'Music Lessons in Boise, ID | Steady Steps Music',
    description: 'Guitar, bass, piano, voice, music theory, and songwriting lessons — online or in-person with Nik in Boise, Idaho. Book a free demo lesson today.',
    url: 'https://steadystepsmusic.com',
    siteName: 'Steady Steps Music',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/hero.jpeg',
        width: 1200,
        height: 630,
        alt: 'Steady Steps Music — Music Lessons in Boise, Idaho',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Music Lessons in Boise, ID | Steady Steps Music',
    description: 'Guitar, bass, piano, voice, music theory, and songwriting lessons — online or in-person with Nik in Boise, Idaho. Book a free demo lesson today.',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'MusicSchool',
  name: 'Steady Steps Music',
  description: 'Expert guitar, bass, piano, voice, music theory, and songwriting lessons in Boise, Idaho — online or in-person. All ages and skill levels welcome.',
  url: 'https://steadystepsmusic.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Boise',
    addressRegion: 'ID',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 43.615,
    longitude: -116.2023,
  },
  areaServed: [
    { '@type': 'City', name: 'Boise' },
    { '@type': 'State', name: 'Idaho' },
    { '@type': 'Country', name: 'United States' },
  ],
  priceRange: '$50–$90',
  currenciesAccepted: 'USD',
  openingHours: 'Mo-Su 09:00-20:00',
  founder: {
    '@type': 'Person',
    name: 'Nik Mathews',
    jobTitle: 'Music Teacher',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Music Lessons',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Guitar Lessons' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Bass Lessons' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Piano Lessons' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Voice Lessons' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Music Theory Lessons' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Songwriting Lessons' } },
    ],
  },
  sameAs: [
    'https://www.instagram.com/steadystepsmusic',
    'https://www.facebook.com/share/18av9MhPhH/',
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do I need my own instrument?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For in-person lessons, yes — having your own instrument to practice at home is important. For online lessons you\'ll need the instrument plus a stable internet connection. I can recommend beginner-friendly instruments at any budget.',
      },
    },
    {
      '@type': 'Question',
      name: 'What ages do you teach?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'I work with students from around 4th grade (age 9-10) and up — teenagers, adults, and seniors. Lessons are always tailored to your age, experience, and goals.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do online lessons work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We meet over Zoom or your preferred video platform. After each lesson I\'ll send you a summary of what we covered, exercises to practice, and any resources like chord charts or sheet music.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need any prior experience?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Not at all — complete beginners are very welcome. Starting from scratch allows us to build good habits and attitudes about musical growth. I also work with intermediate and advanced students who want to break through a plateau.',
      },
    },
    {
      '@type': 'Question',
      name: 'How often should I take lessons?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Once a week is the sweet spot for most students. It gives you enough time to practice between sessions without losing momentum. That said, I\'m flexible — we can discuss what works best for your schedule.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I cancel or reschedule?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Life happens! I ask for at least 24 hours notice to reschedule or cancel. Lessons cancelled with less than 24 hours notice may be charged in full.',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
