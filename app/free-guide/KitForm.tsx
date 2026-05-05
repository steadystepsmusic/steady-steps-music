'use client'

import { useState } from 'react'

// When Kit is set up:
// 1. Create a form in Kit, copy the embed script (data-uid + src)
// 2. Delete this entire component
// 3. In page.tsx, replace <KitForm /> with a <div> and a next/script tag:
//    <Script async data-uid="XXXXXXXX" src="https://[account].kit.com/XXXXXXXX/index.js" />
//    Kit will render the form inside the nearest container div.

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function KitForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '72672cac-8700-4b5b-824c-1b2471e1a7d6',
          email,
          _subject: 'New Guide Download Request — Steady Steps Music',
          _template: 'basic',
        }),
      })

      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-teal-900/40 border border-teal-700 rounded-xl p-6 text-center">
        <p className="text-teal-300 font-semibold text-lg mb-1">You're in.</p>
        <p className="text-slate-400 text-sm">Check your inbox. The guide is on its way.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="flex-1 px-4 py-3 rounded-lg bg-slate-800 text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:border-teal-400 transition-colors"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-900 font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer"
        >
          {status === 'loading' ? 'Sending...' : 'Send Me the Guide'}
        </button>
      </div>
      {status === 'error' && (
        <p className="text-red-400 text-sm">Something went wrong. Try again or email steadystepsmusic@gmail.com.</p>
      )}
    </form>
  )
}
