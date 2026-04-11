'use client'
import { useState } from 'react'
import { songs, Song } from './songs'

export default function RequestsClient() {
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState<'song' | 'artist'>('song')
  const [selected, setSelected] = useState<Song | null>(null)
  const [form, setForm] = useState({ song: '', artist: '', name: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Off-list request state
  const [showOffList, setShowOffList] = useState(false)
  const [offListForm, setOffListForm] = useState({ note: '', name: '' })
  const [offListSent, setOffListSent] = useState(false)
  const [offListLoading, setOffListLoading] = useState(false)
  const [offListError, setOffListError] = useState('')

  const filtered = songs
    .filter(s =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.artist.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) =>
      sortBy === 'song'
        ? a.title.localeCompare(b.title)
        : a.artist.localeCompare(b.artist)
    )

  const handleSelect = (s: Song) => {
    setSelected(s)
    setForm(f => ({ ...f, song: s.title, artist: s.artist }))
    document.getElementById('request-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected) {
      setError('Please select a song from the list above.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '697211a3-d292-481e-946f-aedfed7938d3',
          subject: `Song Request: ${form.song} by ${form.artist}, from ${form.name}`,
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

  const handleOffListSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setOffListLoading(true)
    setOffListError('')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '697211a3-d292-481e-946f-aedfed7938d3',
          subject: `Off-List Request from ${offListForm.name}: ${offListForm.note}`,
          ...offListForm,
        }),
      })
      const data = await res.json()
      if (data.success) setOffListSent(true)
      else setOffListError(data.message || 'Something went wrong. Please try again.')
    } catch {
      setOffListError('Network error. Please try again.')
    }
    setOffListLoading(false)
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
          <div className="flex items-center justify-between mt-2">
            <p className="text-slate-500 text-xs">{filtered.length} song{filtered.length !== 1 ? 's' : ''} · tap to select</p>
            <div className="flex rounded-lg overflow-hidden border border-slate-600 text-xs">
              <button
                type="button"
                onClick={() => setSortBy('song')}
                className={`px-3 py-1 transition-colors ${sortBy === 'song' ? 'bg-teal-600 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'}`}
              >
                Song
              </button>
              <button
                type="button"
                onClick={() => setSortBy('artist')}
                className={`px-3 py-1 transition-colors ${sortBy === 'artist' ? 'bg-teal-600 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'}`}
              >
                Artist
              </button>
            </div>
          </div>
        </div>
        <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-700/50">
          {filtered.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">No songs found.</p>
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
            {/* Selected song display */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Selected Song <span className="text-teal-400">*</span></label>
              {selected ? (
                <div className="w-full px-4 py-3 bg-slate-700/50 border border-teal-600 rounded-xl text-white text-sm">
                  <span className="font-semibold">{selected.title}</span>
                  <span className="text-slate-400"> — {selected.artist}</span>
                  <button
                    type="button"
                    onClick={() => { setSelected(null); setForm(f => ({ ...f, song: '', artist: '' })) }}
                    className="float-right text-slate-400 hover:text-white transition-colors text-xs"
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <div className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600 rounded-xl text-slate-500 text-sm">
                  Tap a song from the list above
                </div>
              )}
            </div>

            {/* Name -- required */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Your Name <span className="text-teal-400">*</span></label>
              <input
                required
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

      {/* Off-list request */}
      <div className="mt-4">
        <button
          onClick={() => setShowOffList(!showOffList)}
          className="w-full text-center text-slate-400 hover:text-teal-400 text-sm transition-colors py-2"
        >
          {showOffList ? 'Never mind' : "Don't see your song? Send Nik a note."}
        </button>

        {showOffList && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 mt-2">
            <h2 className="text-lg font-bold text-white mb-1">Request Something Else</h2>
            <p className="text-slate-400 text-sm mb-4">Nik will do his best -- no guarantees on off-list songs.</p>

            {offListSent ? (
              <div className="text-center py-4">
                <p className="text-white font-bold mb-1">Note sent!</p>
                <p className="text-slate-400 text-sm">Nik will see it.</p>
              </div>
            ) : (
              <form onSubmit={handleOffListSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Your Name <span className="text-teal-400">*</span></label>
                  <input
                    required
                    type="text" value={offListForm.name}
                    onChange={e => setOffListForm({ ...offListForm, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Song / Note <span className="text-teal-400">*</span></label>
                  <input
                    required
                    type="text" value={offListForm.note}
                    onChange={e => setOffListForm({ ...offListForm, note: e.target.value })}
                    placeholder="e.g. Shake It Off by Taylor Swift"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors"
                  />
                </div>
                {offListError && <p className="text-red-400 text-sm text-center">{offListError}</p>}
                <button
                  type="submit" disabled={offListLoading}
                  className="w-full py-3 bg-slate-600 hover:bg-slate-500 disabled:opacity-50 text-white font-bold rounded-xl transition-colors"
                >
                  {offListLoading ? 'Sending...' : 'Send Note'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </>
  )
}
