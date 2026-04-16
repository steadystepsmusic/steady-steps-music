'use client'
import { useState, useEffect } from 'react'

const links = [
  { href: '#about',        label: 'About' },
  { href: '#lessons',      label: 'Lessons' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#pricing',      label: 'Pricing' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#contact',      label: 'Contact' },
]

export default function Nav() {
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/95 backdrop-blur shadow-lg' : 'bg-transparent'}`}>
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <svg viewBox="0 0 45 35" height="30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" shapeRendering="crispEdges">
            <rect x="0"  y="30" width="15" height="5" fill="#162D6E"/>
            <rect x="10" y="25" width="5"  height="5" fill="#162D6E"/>
            <rect x="10" y="20" width="15" height="5" fill="#2563EB"/>
            <rect x="20" y="15" width="5"  height="5" fill="#2563EB"/>
            <rect x="20" y="10" width="15" height="5" fill="#7DD3FC"/>
            <rect x="30" y="5"  width="5"  height="5" fill="#7DD3FC"/>
            <rect x="30" y="0"  width="15" height="5" fill="#2DD4BF"/>
          </svg>
          <span className="font-bold text-white text-2xl md:text-4xl leading-tight">
            Steady <span className="text-teal-400">Steps</span> Music
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <a key={l.href} href={l.href}
              className="text-slate-300 hover:text-teal-400 text-sm font-medium transition-colors">
              {l.label}
            </a>
          ))}
          <a href="#contact"
            className="ml-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl text-sm transition-colors">
            Book Free Lesson
          </a>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} className="md:hidden text-white p-2">
          <div className={`w-6 h-0.5 bg-white transition-all mb-1.5 ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <div className={`w-6 h-0.5 bg-white transition-all mb-1.5 ${open ? 'opacity-0' : ''}`} />
          <div className={`w-6 h-0.5 bg-white transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-slate-900 border-t border-slate-700 px-6 py-4 flex flex-col gap-4">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="text-slate-300 hover:text-teal-400 font-medium transition-colors">
              {l.label}
            </a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)}
            className="px-4 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl text-center transition-colors">
            Book Free Lesson
          </a>
        </div>
      )}
    </header>
  )
}
