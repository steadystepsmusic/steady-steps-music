import Image from 'next/image'
import { songs } from '../requests/songs'
import type { Metadata } from 'next'
import BookingForm from './BookingForm'
import { genreGroups } from './genreGroups'

export const metadata: Metadata = {
  title: 'Nik Mathews | Singer & Guitarist',
  description: 'Solo acoustic singer and guitarist available for bars, restaurants, breweries, wineries, weddings, and private events in Boise, ID.',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'Nik Mathews | Singer & Guitarist',
    description: 'Solo acoustic singer and guitarist available for bars, restaurants, breweries, wineries, weddings, and private events in Boise, ID.',
    url: 'https://nikmathewsmusic.com',
    siteName: 'Nik Mathews Music',
    images: [
      {
        url: 'https://nikmathewsmusic.com/images/IMG_4432.jpg',
        width: 1080,
        height: 1350,
        alt: 'Nik Mathews performing solo acoustic',
      },
    ],
    type: 'website',
  },
}

export default function NikMathewsPage() {
  return (
    <main style={{ backgroundColor: '#0a0a0a', color: '#ffffff', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

      {/* Hero */}
      <section style={{ position: 'relative', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <Image
          src="/images/nik-mathews-hero.jpeg"
          alt="Nik Mathews performing solo acoustic"
          fill
          style={{ objectFit: 'cover', objectPosition: '15% 10%', opacity: 0.45 }}
          priority
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.6) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '0 1.5rem' }}>
          <h1 style={{
            fontSize: 'clamp(3rem, 10vw, 7rem)',
            fontWeight: 700,
            letterSpacing: '0.15em',
            color: '#c9a84c',
            textTransform: 'uppercase',
            margin: 0,
            lineHeight: 1,
          }}>
            Nik Mathews
          </h1>
          <p style={{ marginTop: '1rem', fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', letterSpacing: '0.35em', color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase' }}>
            Singer &amp; Guitarist
          </p>
          <div style={{ margin: '1.5rem auto', width: '4rem', height: '1px', backgroundColor: '#c9a84c' }} />
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>
            Public &amp; Private Events <span className="nik-bullet">&nbsp;·&nbsp;</span> <span style={{ whiteSpace: 'nowrap' }}>Boise, ID</span>
          </p>
        </div>
      </section>

      {/* About */}
      <section style={{ maxWidth: '720px', margin: '0 auto', padding: '4rem 1.5rem 2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '1.25rem', lineHeight: 1.9, color: 'rgba(255,255,255,0.72)', margin: 0 }}>
          Nik Mathews is a Boise-based singer and guitarist with over 20 years of performance experience. Drawing from a wide variety of styles and songs spanning rock, country, folk, and pop,
          he delivers a versatile, crowd-pleasing show for bars, restaurants, breweries, and wineries, as well as weddings, corporate events, and private parties.
          Using a live loop pedal to layer guitar parts in real time, he creates a full, dynamic sound that goes well beyond a typical solo act.
          Fully self-contained with professional PA.
        </p>
      </section>

      {/* Video */}
      <section style={{ padding: '1.5rem 1.5rem 4rem' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.25em', fontSize: '0.95rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            Watch &amp; Listen
          </p>
          <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(201,168,76,0.2)' }}>
            <iframe
              src="https://www.youtube.com/embed/nRV2XqenyKc"
              title="Nik Mathews Live Performance"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
            />
          </div>
        </div>
      </section>

      {/* Photos */}
      <section style={{ padding: '2rem 1.5rem 5rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '6px' }}>
          <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden', borderRadius: '4px' }}>
            <Image src="/images/IMG_2584.JPG" alt="Nik Mathews acoustic guitar" fill style={{ objectFit: 'cover', objectPosition: 'center 20%' }} />
          </div>
          <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden', borderRadius: '4px' }}>
            <Image src="/images/IMG_4493.jpeg" alt="Nik Mathews live at a venue" fill style={{ objectFit: 'cover', objectPosition: 'center 30%' }} />
          </div>
          <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden', borderRadius: '4px' }}>
            <Image src="/images/IMG_0765.JPG" alt="Nik Mathews performing at a bar" fill style={{ objectFit: 'cover', objectPosition: 'center 15%' }} />
          </div>
          <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden', borderRadius: '4px' }}>
            <Image src="/images/IMG_4432.jpg" alt="Nik Mathews performing live" fill style={{ objectFit: 'cover', objectPosition: 'center 10%' }} />
          </div>
        </div>
        <div style={{ marginTop: '3rem' }}>
          <p style={{ textAlign: 'center', color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.25em', fontSize: '0.95rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            Get in Touch
          </p>
          <BookingForm />
        </div>
      </section>

      {/* Setlist */}
      <section style={{ padding: '4rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', color: '#c9a84c', textTransform: 'uppercase', letterSpacing: '0.25em', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Setlist
          </p>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '1rem', marginBottom: '3rem', marginTop: 0 }}>
            Over 200 songs available across a variety of genres, plus requests!
          </p>
          {genreGroups.map(({ genre, songs: genreSongs }) => (
            <div key={genre} style={{ marginBottom: '3rem' }}>
              <h3 style={{
                color: '#c9a84c',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                fontSize: '0.8rem',
                fontWeight: 600,
                borderBottom: '1px solid rgba(201,168,76,0.25)',
                paddingBottom: '0.5rem',
                marginBottom: '1rem',
                marginTop: 0,
              }}>
                {genre}
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '0',
              }}>
                {genreSongs.sort((a, b) => a.localeCompare(b)).map((title) => {
                  const song = songs.find(s => s.title === title)
                  if (!song) return null
                  return (
                    <div
                      key={title}
                      style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500, color: 'rgba(255,255,255,0.88)', lineHeight: 1.3 }}>{song.title}</p>
                      <p style={{ margin: '0.1rem 0 0', fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)' }}>{song.artist}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '4rem 1.5rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.2em', color: '#c9a84c', textTransform: 'uppercase' }}>
          Nik Mathews
        </p>
        <p style={{ margin: '0.4rem 0 0', fontSize: '0.9rem', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
          Singer &amp; Guitarist
        </p>
        <a
          href="https://www.instagram.com/nikmathewsmusic"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.75rem', padding: '0.75rem 2rem', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.95rem', fontWeight: 600, borderRadius: '2px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
          </svg>
          @nikmathewsmusic
        </a>
      </footer>

    </main>
  )
}
