'use client'

import { useState } from 'react'

const NMM_FAN_LIST_ID = 5

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function FanSignupForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, listId: NMM_FAN_LIST_ID }),
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
      <div className="mt-4 bg-slate-800/50 border border-slate-700 rounded-2xl p-6 text-center">
        <p className="text-teal-300 font-semibold">You're on the list!</p>
        <p className="text-slate-400 text-sm mt-1">I'll let you know about new shows and music.</p>
      </div>
    )
  }

  return (
    <div className="mt-4 bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
      <p className="text-white font-bold text-sm mb-1">Get updates on shows and new music</p>
      <p className="text-slate-400 text-sm mb-4">No spam, just the occasional update from Nik.</p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Your email address"
          className="flex-1 px-4 py-3 rounded-xl bg-slate-900 text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:border-teal-400 transition-colors"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-900 font-bold rounded-xl transition-colors whitespace-nowrap"
        >
          {status === 'loading' ? 'Joining...' : 'Sign Up'}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-red-400 text-sm mt-2">Something went wrong. Please try again.</p>
      )}
    </div>
  )
}
