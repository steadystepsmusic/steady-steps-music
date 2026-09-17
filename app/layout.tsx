import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { FAQS } from './site'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Music Lessons in Boise, ID | Guitar, Piano, Voice & More | Steady Steps Music',
  description:
    'Expert guitar, bass, piano, voice, music theory, and songwriting lessons in Boise, Idaho, online or in-person. Taught by Nik, 20+ years experience. Book a free 15-minute demo lesson today. All skill levels welcome.',
  keywords: 'music lessons boise idaho, guitar lessons boise, piano lessons boise, voice lessons boise, bass lessons boise, online music lessons, songwriting lessons, music theory lessons, music teacher boise, beginner guitar lessons, adult music lessons boise, kids music lessons boise',
  metadataBase: new URL('https://steadystepsmusic.com'),
  alternates: {
    canonical: 'https://steadystepsmusic.com',
  },
  openGraph: {
    title: 'Music Lessons in Boise, ID | Steady Steps Music',
    description: 'Guitar, bass, piano, voice, music theory, and songwriting lessons, online or in-person with Nik in Boise, Idaho. Book a free demo lesson today.',
    url: 'https://steadystepsmusic.com',
    siteName: 'Steady Steps Music',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Steady Steps Music: Music Lessons in Boise, Idaho',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Music Lessons in Boise, ID | Steady Steps Music',
    description: 'Guitar, bass, piano, voice, music theory, and songwriting lessons, online or in-person with Nik in Boise, Idaho. Book a free demo lesson today.',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'MusicSchool',
  name: 'Steady Steps Music',
  description: 'Expert guitar, bass, piano, voice, music theory, and songwriting lessons in Boise, Idaho, online or in-person. All ages and skill levels welcome.',
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
  // Generated from the same FAQS array the pages render, so the structured
  // data can never drift out of sync with the visible copy.
  mainEntity: FAQS.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-MJDRD02LDT" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-MJDRD02LDT');`,
          }}
        />
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
