'use client'
import { useState } from 'react'

export default function RequestForm() {
  const [form, setForm] = useState({ song: '', artist: '', name: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_key: '697211a3-d292-481e-946f-aedfed7938d3', song: form.song, artist: form.artist, guest_name: form.name }),
      })
      const data = await res.json()
      if (data.success) setSent(true)
      else setError(data.message || 'Something went wrong. Please try again.')
    } catch {
      setError('Network error. Please try again.')
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-6">🎵</div>
        <h2 className="text-3xl font-black text-white mb-3">Request sent!</h2>
        <p className="text-slate-300 mb-8">We&apos;ll do our best to play <strong className="text-teal-400">{form.song}</strong> for you.</p>
        <button
          onClick={() => { setForm({ song: '', artist: '', name: '' }); setSent(false) }}
          className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-colors"
        >
          Submit Another Request
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Song Title <span className="text-teal-400">*</span></label>
        <input
          required type="text" value={form.song}
          onChange={e => setForm({ ...form, song: e.target.value })}
          placeholder="e.g. Wonderwall"
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Artist <span className="text-teal-400">*</span></label>
        <input
          required type="text" value={form.artist}
          onChange={e => setForm({ ...form, artist: e.target.value })}
          placeholder="e.g. Oasis"
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Your Name <span className="text-slate-500">(optional)</span></label>
        <input
          type="text" value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder="So we can give you a shoutout!"
          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors"
        />
      </div>
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      <button
        type="submit" disabled={loading}
        className="w-full py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 font-black rounded-xl text-lg transition-colors mt-2"
      >
        {loading ? 'Sending...' : 'Send Request'}
      </button>
    </form>
  )
}
