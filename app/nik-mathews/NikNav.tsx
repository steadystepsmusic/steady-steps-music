'use client'
import { useState, useEffect } from 'react'

export default function NikNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header style={{
      position: 'sticky', top: 0, left: 0, right: 0, zIndex: 50,
      transition: 'background 0.3s, box-shadow 0.3s',
      background: scrolled ? 'rgba(10,10,10,0.92)' : 'rgba(10,10,10,0.75)',
      backdropFilter: 'blur(8px)',
      boxShadow: scrolled ? '0 1px 0 rgba(201,168,76,0.15)' : 'none',
    }}>
      <nav style={{
        maxWidth: '1000px', margin: '0 auto', padding: '0 1rem',
        height: '68px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
      }}>

        {/* LEFT: Logo */}
        <a href="#" aria-label="Nik Mathews Music" style={{ flexShrink: 0 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 260" height="56" style={{ display: 'block' }}>
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

        {/* RIGHT: Watch & Listen + Book Now */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>

          <a href="#video"
            style={{
              padding: '0.45rem 0.85rem',
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.75)',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontSize: '0.7rem',
              fontWeight: 600,
              borderRadius: '2px',
              transition: 'background 0.2s, color 0.2s, border-color 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget
              el.style.background = 'rgba(255,255,255,0.15)'
              el.style.color = '#fff'
              el.style.borderColor = 'rgba(255,255,255,0.35)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget
              el.style.background = 'rgba(255,255,255,0.08)'
              el.style.color = 'rgba(255,255,255,0.75)'
              el.style.borderColor = 'rgba(255,255,255,0.2)'
            }}>
            Watch &amp; Listen
          </a>

          <a href="#booking"
            style={{
              padding: '0.45rem 1rem',
              background: '#c9a84c',
              border: '1px solid #c9a84c',
              color: '#0a0a0a',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontSize: '0.7rem',
              fontWeight: 700,
              borderRadius: '2px',
              transition: 'background 0.2s, color 0.2s',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget
              el.style.background = '#d4b65a'
              el.style.borderColor = '#d4b65a'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget
              el.style.background = '#c9a84c'
              el.style.borderColor = '#c9a84c'
            }}>
            Book Now
          </a>

        </div>

      </nav>
    </header>
  )
}
