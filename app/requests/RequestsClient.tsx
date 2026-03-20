'use client'
import { useState } from 'react'
import { songs, Song } from './songs'

export default function RequestsClient() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Song | null>(null)
  const [form, setForm] = useState({ song: '', artist: '', name: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const filtered = songs.filter(s =>
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.artist.toLowerCase().includes(query.toLowerCase())
  )

  const handleSelect = (s: Song) => {
    setSelected(s)
    setForm(f => ({ ...f, song: s.title, artist: s.artist }))
    // Scroll to form
    document.getElementById('request-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '697211a3-d292-481e-946f-aedfed7938d3',
          subject: `Song Request: ${form.song} by ${form.artist}${form.name ? ` — from ${form.name}` : ''}`,
          ...form,
        }),
      })
      const data = await res.json()
      if (data.success) setSent(true)
      else setError(data.message || 'Something went wrong. Please try again.')
    } catch {
      setError('Network error. Please try again.')
    }
    setLoading(false)
  }

  return (
    <>
      {/* Song list */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 mb-6">
        <div className="p-4 border-b border-slate-700">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search songs or artists..."
            className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors text-sm"
          />
          <p className="text-slate-500 text-xs mt-2">{filtered.length} song{filtered.length !== 1 ? 's' : ''} in the setlist · tap to select</p>
        </div>
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-700/50">
          {filtered.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">No songs found — but feel free to request anyway!</p>
          ) : (
            filtered.map(s => (
              <button
                key={`${s.title}-${s.artist}`}
                onClick={() => handleSelect(s)}
                className={`w-full px-5 py-4 flex justify-between items-center gap-4 text-left transition-colors hover:bg-slate-700/50 ${selected?.title === s.title && selected?.artist === s.artist ? 'bg-teal-900/40 border-l-4 border-teal-400' : ''}`}
              >
                <span className="text-white text-base font-semibold">{s.title}</span>
                <span className="text-slate-400 text-sm text-right shrink-0">{s.artist}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Request form */}
      <div id="request-form" className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <h2 className="text-lg font-bold text-white mb-4">Submit Your Request</h2>

        {sent ? (
          <div className="text-center py-8">
            <h3 className="text-2xl font-black text-white mb-2">Request sent!</h3>
            <p className="text-slate-300 mb-6">We&apos;ll do our best to play <strong className="text-teal-400">{form.song}</strong> for you.</p>
            <button
              onClick={() => { setForm({ song: '', artist: '', name: '' }); setSelected(null); setSent(false) }}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-colors"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
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
        )}
      </div>
    </>
  )
}
