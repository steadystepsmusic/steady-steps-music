import { Metadata } from 'next'
import { songs } from './data'
import { TabHeader, TabCta } from './TabShell'

export const metadata: Metadata = {
  title: 'Free Guitar Tab Sheets: Steady Steps Music',
  robots: { index: false, follow: false },
}

export default function TabLibraryPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <TabHeader
        eyebrow="Free Downloads"
        title="Guitar Tab Sheets"
        description="Tab sheets from the Steady Steps YouTube series. Pick a song below, then download it, open it in your browser, and print it or save it as a PDF to keep on your music stand."
      />

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-4">
        {songs.map(song => (
          <a
            key={song.slug}
            href={`/tab/${song.slug}`}
            className="block bg-slate-800 border border-slate-700 hover:border-teal-500 rounded-2xl p-6 no-underline transition-colors"
          >
            <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">{song.episode}</span>
            <h2 className="text-white font-black text-xl mt-1">{song.title}</h2>
            <p className="text-slate-400 text-sm mt-1 leading-relaxed">{song.description}</p>
          </a>
        ))}
      </div>

      <TabCta />
    </div>
  )
}
