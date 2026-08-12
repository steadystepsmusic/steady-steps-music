'use client'
import { useState } from 'react'

export default function BookingForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_key: 'babdd6d6-3df0-4e4a-a08b-e6012c7c8369', subject: 'Booking Inquiry | Nik Mathews', ...form }),
    })
    const data = await res.json()
    if (data.success) setSent(true)
    setLoading(false)
  }

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '2px',
    color: '#ffffff',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    color: 'rgba(255,255,255,0.45)',
    marginBottom: '0.4rem',
  }

  if (sent) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: '#c9a84c', fontSize: '1.1rem', fontWeight: 600, letterSpacing: '0.1em' }}>Message sent!</p>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', marginTop: '0.5rem' }}>Thanks {form.name}, I&apos;ll be in touch soon.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '480px', margin: '0 auto' }}>
      <div>
        <label style={labelStyle}>Name</label>
        <input
          required
          type="text"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder="Your name"
          style={inputStyle}
        />
      </div>
      <div>
        <label style={labelStyle}>Email</label>
        <input
          required
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          placeholder="your@email.com"
          style={inputStyle}
        />
      </div>
      <div>
        <label style={labelStyle}>Message</label>
        <textarea
          required
          value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
          placeholder="Tell me about your event or venue..."
          rows={4}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '0.85rem 2rem',
          backgroundColor: 'transparent',
          border: '1px solid #c9a84c',
          color: '#c9a84c',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          fontSize: '0.95rem',
          fontWeight: 600,
          borderRadius: '2px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>
      <a
        href="https://www.instagram.com/nikmathewsmusic"
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem 2rem', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.95rem', fontWeight: 600, borderRadius: '2px' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
        </svg>
        @nikmathewsmusic
      </a>
    </form>
  )
}
