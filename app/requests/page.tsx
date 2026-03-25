import RequestsClient from './RequestsClient'

export const metadata = {
  title: 'Song Requests — Steady Steps Music',
  description: 'Browse the setlist and request a song live!',
}

export default function RequestsPage() {
  return (
    <div className="min-h-screen bg-slate-900 px-6 py-16">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <a href="https://steadystepsmusic.com" className="inline-block mb-6 text-sm text-slate-400 hover:text-teal-400 transition-colors">
            ← Steady Steps Music
          </a>
          <h1 className="text-4xl font-black text-white mb-2">Request a Song</h1>
          <p className="text-slate-400">Browse the setlist, tap a song, then hit send!</p>
        </div>

        <RequestsClient />

        {/* Funnel link */}
        <div className="mt-6 text-center bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <p className="text-slate-300 text-sm mb-3">Want to learn to play music yourself?</p>
          <a
            href="https://steadystepsmusic.com"
            className="inline-block px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl transition-colors text-sm"
          >
            Book a Free Lesson with Nik →
          </a>
        </div>

      </div>
    </div>
  )
}
