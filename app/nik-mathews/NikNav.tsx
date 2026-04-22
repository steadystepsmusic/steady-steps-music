'use client'
import { useState, useEffect } from 'react'

export default function NikNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      transition: 'background 0.3s, box-shadow 0.3s',
      background: scrolled ? 'rgba(10,10,10,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(8px)' : 'none',
      boxShadow: scrolled ? '0 1px 0 rgba(201,168,76,0.15)' : 'none',
    }}>
      <nav style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1.5rem', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Monogram mark — cropped to letters only, no text */}
        <a href="#" aria-label="Nik Mathews Music">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 260" height="52" style={{ display: 'block' }}>
            <defs>
              <linearGradient id="navGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#f0d478', stopOpacity: 1 }} />
                <stop offset="45%" style={{ stopColor: '#c9a84c', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#9a7228', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <text x="105" y="147" textAnchor="middle"
              fontFamily="'Cormorant Garamond', Garamond, 'Times New Roman', Georgia, serif"
              fontSize="106" fontStyle="italic" fontWeight="300" fill="#ffffff">N</text>
            <text x="221" y="244" textAnchor="middle"
              fontFamily="'Cormorant Garamond', Garamond, 'Times New Roman', Georgia, serif"
              fontSize="106" fontStyle="italic" fontWeight="300" fill="#ffffff">M</text>
            <text x="160" y="200" textAnchor="middle"
              fontFamily="'Cormorant Garamond', Garamond, 'Times New Roman', Georgia, serif"
              fontSize="132" fontStyle="italic" fontWeight="700" fill="url(#navGoldGrad)">M</text>
          </svg>
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>

        {/* Watch & Listen */}
        <a href="#video" style={{
          color: 'rgba(255,255,255,0.65)',
          textDecoration: 'none',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          fontSize: '0.8rem',
          fontWeight: 600,
          transition: 'color 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.color = '#c9a84c')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}>
          Watch &amp; Listen
        </a>

        {/* Instagram */}
        <a href="https://www.instagram.com/nikmathewsmusic" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#c9a84c')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
          </svg>
        </a>

        {/* Book CTA */}
        <a href="#booking" style={{
          padding: '0.55rem 1.4rem',
          border: '1px solid #c9a84c',
          color: '#c9a84c',
          textDecoration: 'none',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          fontSize: '0.8rem',
          fontWeight: 600,
          borderRadius: '2px',
          transition: 'background 0.2s, color 0.2s',
        }}
          onMouseEnter={e => { (e.target as HTMLAnchorElement).style.background = '#c9a84c'; (e.target as HTMLAnchorElement).style.color = '#0a0a0a' }}
          onMouseLeave={e => { (e.target as HTMLAnchorElement).style.background = 'transparent'; (e.target as HTMLAnchorElement).style.color = '#c9a84c' }}
        >
          Book Now
        </a>

        </div>

      </nav>
    </header>
  )
}
