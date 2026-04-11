import RequestsClient from './RequestsClient'

export const metadata = {
  title: 'Song Requests | Steady Steps Music',
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

        {/* Tip link */}
        <div className="mt-6 text-center bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
          <p className="text-slate-300 text-sm mb-3">Feeling generous? Send Nik a tip for your request.</p>
          <a
            href="https://venmo.com/code?user_id=2009457366138880646&created=1710189721.169592&printed=1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 bg-[#3D95CE] hover:bg-[#2e7db5] text-white font-bold rounded-xl transition-colors text-sm"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.4 2C20.1 3.3 20.4 4.6 20.4 6.3c0 5.1-4.3 11.7-7.8 16.3H4.9L2 3.1l6.7-.6 1.6 12.9c1.5-2.5 3.3-6.4 3.3-9.1 0-1.5-.3-2.5-.7-3.3L19.4 2z"/>
            </svg>
            Tip Nik on Venmo
          </a>
        </div>

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
