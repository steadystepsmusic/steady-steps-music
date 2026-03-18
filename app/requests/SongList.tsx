'use client'
import { useState } from 'react'
import { songs } from './songs'

export default function SongList() {
  const [query, setQuery] = useState('')

  const filtered = songs.filter(s =>
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.artist.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div>
      <div className="p-4 border-b border-slate-700">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search songs or artists..."
          className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors text-sm"
        />
        <p className="text-slate-500 text-xs mt-2">{filtered.length} song{filtered.length !== 1 ? 's' : ''} in the setlist</p>
      </div>
      <div className="max-h-72 overflow-y-auto divide-y divide-slate-700/50">
        {filtered.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">No songs found — but feel free to request anyway!</p>
        ) : (
          filtered.map(s => (
            <div key={`${s.title}-${s.artist}`} className="px-4 py-3 flex justify-between items-center gap-4">
              <span className="text-white text-sm font-medium">{s.title}</span>
              <span className="text-slate-400 text-xs text-right shrink-0">{s.artist}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
